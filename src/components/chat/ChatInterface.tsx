import React, { useEffect, useRef, useState } from "react";
import {
  PlusCircle,
  Trash2,
  MoreVertical,
  Bot,
  User,
  Copy,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/services/apiClient";
import { userService } from "@/services/userService";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  model?: string;
}

const models = [
  { id: "gpt-4o", name: "GPT-4o", serverId: "chatgpt", color: "bg-blue-500" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", serverId: "gemini", color: "bg-green-500" },
  { id: "claude-3", name: "Claude 3", serverId: "claude", color: "bg-purple-500" },
  { id: "llama-3", name: "Llama 3", serverId: "llama", color: "bg-amber-500" },
];

const getModelBadge = (modelId: string) => {
  const model = models.find((m) => m.serverId === modelId || m.id === modelId);
  return model ? (
    <div className={`text-xs px-2 py-1 rounded-full text-white ${model.color}`}>
      {model.name}
    </div>
  ) : null;
};

const formatAssistantContent = (text: string) => {
  const codeRegex = /```([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<p key={lastIndex}>{text.slice(lastIndex, match.index)}</p>);
    }
    parts.push(
      <pre key={match.index} className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
        <code>{match[1]}</code>
      </pre>
    );
    lastIndex = codeRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<p key={lastIndex}>{text.slice(lastIndex)}</p>);
  }

  return parts;
};

const ChatInterface = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const userId = userService.getUser().userId;

  useEffect(() => {
    fetchChatrooms();
  }, []);

  useEffect(() => {
    if (activeConversationId) fetchMessages(activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatrooms = async () => {
    try {
      const rooms: any = await apiFetch(`/chatroom/chat/rooms/${userId}`);
      rooms.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setConversations(rooms);
      if (rooms.length) setActiveConversationId(rooms[0].chatroomId);
    } catch {
      toast({ description: "Failed to load conversations." });
    }
  };

  const fetchMessages = async (chatroomId: string) => {
    try {
      const res: any = await apiFetch(`/chatroom/chat/messages/${chatroomId}`);
      const parsed = res.map((m: any, index: number) => ({
        id: index.toString(),
        content: m.message,
        sender: m.role,
        timestamp: new Date(m.createdAt),
        model: m.model,
      }));
      setMessages(parsed);
    } catch {
      toast({ description: "Failed to load messages." });
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsSending(true);

    try {
      const serverModel = models.find((m) => m.id === selectedModel)?.serverId || "chatgpt";
      const res: any = await apiFetch("/chat/chat/sendMessage", {
        method: "POST",
        body: JSON.stringify({
          userId,
          chatroomId: activeConversationId || "",
          message: inputMessage,
          model: serverModel,
        }),
      });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: res.response,
        sender: "assistant",
        timestamp: new Date(),
        model: res.model || serverModel,
      };

      setMessages([...updatedMessages, assistantMsg]);
      setIsSending(false);

      if (!activeConversationId) {
        await fetchChatrooms();
        setActiveConversationId(res.chatroomId);
      }
    } catch {
      toast({ description: "Message send failed." });
      setIsSending(false);
    }
  };

  const handleDeleteConversation = async (chatroomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiFetch(`/chatroom/chatroom/${chatroomId}`, { method: "DELETE" });
      const updated = conversations.filter((c) => c.chatroomId !== chatroomId);
      setConversations(updated);
      if (chatroomId === activeConversationId) {
        setActiveConversationId(updated[0]?.chatroomId || null);
        setMessages([]);
      }
    } catch {
      toast({ description: "Failed to delete chatroom." });
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diff < 604800000) return date.toLocaleDateString([], { weekday: "short" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden animate-fade-in">
      {/* Sidebar */}
      <aside className="bg-[#f7f7f8] w-72 border-r border-border">
        <div className="p-4">
          <Button
            onClick={() => {
              setActiveConversationId(null);
              setMessages([]);
            }}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="px-2 py-2">
            <h2 className="px-2 mb-2 text-sm font-medium text-muted-foreground">
              Recent Conversations
            </h2>
            {conversations.map((conversation) => (
              <div
                key={conversation.chatroomId}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg mb-1 transition-colors flex justify-between items-center group ${
                  conversation.chatroomId === activeConversationId
                    ? "bg-[#f1e4ff] text-purple-700 font-medium"
                    : "hover:bg-muted text-foreground"
                }`}
                onClick={() => setActiveConversationId(conversation.chatroomId)}
              >
                <div className="flex-1 truncate">
                  <div className="truncate">{conversation.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(new Date(conversation.createdAt))}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => handleDeleteConversation(conversation.chatroomId, e)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full relative">
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%] md:max-w-[70%] animate-fade-in flex">
                  {message.sender === "assistant" && (
                    <div className="mr-3 mt-1">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                  )}
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-3 group ${
                        message.sender === "user"
                          ? "bg-purple-500 text-white ml-auto rounded-tr-none"
                          : "bg-blue-100 text-black rounded-tl-none"
                      }`}
                    >
                      <div className="whitespace-pre-line">
                        {message.sender === "assistant"
                          ? formatAssistantContent(message.content)
                          : message.content}
                      </div>
                      {message.sender === "assistant" && message.model && (
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-xs opacity-70">{getModelBadge(message.model)}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => navigator.clipboard.writeText(message.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 mx-1">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                  {message.sender === "user" && (
                    <div className="ml-3 mt-1">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-700" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border bg-background p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center">
                  <span>Model:</span>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="h-7 w-40 ml-2 text-xs border-none">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id} className="text-xs">
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-xs">Shift + Enter for new line</span>
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 resize-none border-border bg-background min-h-[60px] max-h-[200px] rounded-xl"
                  disabled={isSending}
                />
                <Button
                  onClick={handleSend}
                  className="self-end h-[60px] w-[60px] rounded-full shrink-0 bg-purple-500 hover:bg-purple-600 text-white"
                  disabled={!inputMessage.trim() || isSending}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
