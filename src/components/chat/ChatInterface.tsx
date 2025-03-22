import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Send, Trash2, MoreVertical, Robot, User, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  model?: string;
  isTyping?: boolean;
}

const models = [
  { id: 'gpt-4o', name: 'GPT-4o', color: 'bg-blue-500' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', color: 'bg-green-500' },
  { id: 'claude-3', name: 'Claude 3', color: 'bg-purple-500' },
  { id: 'llama-3', name: 'Llama 3', color: 'bg-amber-500' },
];

const ChatInterface = () => {
  const [conversations, setConversations] = useState<{ id: string; title: string; updatedAt: Date }[]>([
    { id: '1', title: 'Website design ideas', updatedAt: new Date(Date.now() - 1000 * 60 * 10) },
    { id: '2', title: 'Marketing strategy', updatedAt: new Date(Date.now() - 1000 * 60 * 60) },
    { id: '3', title: 'Product development', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  ]);
  
  const [activeConversationId, setActiveConversationId] = useState<string | null>('1');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [isSending, setIsSending] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    // Set some initial messages when conversation changes
    if (activeConversationId) {
      const initialMessages: ChatMessage[] = [
        {
          id: '1',
          content: 'Hello! How can I help you today?',
          sender: 'assistant',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          model: 'gpt-4o',
        },
      ];
      
      if (activeConversationId === '1') {
        initialMessages.push(
          {
            id: '2',
            content: 'I need some ideas for my company website redesign.',
            sender: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 14),
          },
          {
            id: '3',
            content: 'I\'d be happy to help with your website redesign! Here are some modern design trends:\n\n1. Minimalist aesthetics with ample white space\n2. Bold typography and micro-interactions\n3. Subtle animations and transitions\n4. Glass morphism effects\n5. Asymmetrical layouts\n\nWould you like more specific suggestions for any of these approaches?',
            sender: 'assistant',
            timestamp: new Date(Date.now() - 1000 * 60 * 13),
            model: 'gpt-4o',
          }
        );
      }
      
      setMessages(initialMessages);
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Less than a week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  const handleSend = () => {
    if (!inputMessage.trim() || isSending) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);
    
    // Simulate typing indicator
    const botTypingMessage: ChatMessage = {
      id: 'typing',
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true,
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, botTypingMessage]);
      
      // Simulate bot response after delay
      setTimeout(() => {
        const responseOptions = [
          "I understand what you're looking for. Let me think about that...",
          "That's an interesting question! Here's what I can suggest based on my knowledge.",
          "Thank you for providing that information. Let me analyze this and give you a thoughtful response.",
          "I see what you're asking. Based on the latest research and best practices, here's what I recommend."
        ];
        
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: responseOptions[Math.floor(Math.random() * responseOptions.length)],
          sender: 'assistant',
          timestamp: new Date(),
          model: selectedModel,
        };
        
        setMessages(prev => prev.filter(m => !m.isTyping).concat(botResponse));
        setIsSending(false);
        
        // Update conversation last updated time
        if (activeConversationId) {
          setConversations(prev => 
            prev.map(conv => 
              conv.id === activeConversationId 
                ? { ...conv, title: inputMessage.substring(0, 20) + (inputMessage.length > 20 ? '...' : ''), updatedAt: new Date() } 
                : conv
            )
          );
        }
      }, 1500);
    }, 500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleNewChat = () => {
    const newConvId = (Date.now()).toString();
    const newConversation = { 
      id: newConvId, 
      title: 'New conversation', 
      updatedAt: new Date() 
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConvId);
    setMessages([]);
    setIsMobileMenuOpen(false);
  };
  
  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Remove the conversation
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    // If active conversation is deleted, set the first available or null
    if (id === activeConversationId) {
      const remainingConvs = conversations.filter(conv => conv.id !== id);
      setActiveConversationId(remainingConvs.length > 0 ? remainingConvs[0].id : null);
    }
    
    toast({
      description: "Conversation deleted",
    });
  };

  const getModelBadge = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return null;
    
    return (
      <div className={`text-xs px-2 py-1 rounded-full text-white ${model.color}`}>
        {model.name}
      </div>
    );
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copied to clipboard",
    });
  };
  
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden animate-fade-in">
      {/* Chat List - Sidebar */}
      <aside 
        className={`bg-muted/50 w-72 border-r border-border transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } absolute md:relative z-30 h-full`}
      >
        <div className="p-4">
          <Button 
            onClick={handleNewChat}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="px-2 py-2">
            <h2 className="px-2 mb-2 text-sm font-medium text-muted-foreground">Recent Conversations</h2>
            {conversations.map(conversation => (
              <button
                key={conversation.id}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg mb-1 transition-colors flex justify-between items-center group ${
                  conversation.id === activeConversationId
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted text-foreground'
                }`}
                onClick={() => {
                  setActiveConversationId(conversation.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex-1 truncate">
                  <div className="truncate">{conversation.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(conversation.updatedAt)}
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
                      onClick={(e) => handleDeleteConversation(conversation.id, e as React.MouseEvent)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost" 
          size="icon"
          className="absolute top-2 left-2 md:hidden z-20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <Trash2 className="h-5 w-5" /> : <MoreVertical className="h-5 w-5" />}
        </Button>
        
        {activeConversationId ? (
          <>
            {/* Chat messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-6 pb-20">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                    <div className="relative w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Robot className="h-12 w-12 text-primary animate-pulse-soft" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">How can I help you today?</h3>
                    <p className="text-muted-foreground max-w-md">
                      Ask me anything about your work, projects, or ideas. I'm here to assist.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] animate-fade-in flex`}>
                        {message.sender === 'assistant' && (
                          <div className="mr-3 mt-1">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Robot className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <div 
                            className={`
                              rounded-2xl px-4 py-3 group 
                              ${message.sender === 'user' 
                                ? 'bg-primary text-primary-foreground ml-auto rounded-tr-none' 
                                : message.isTyping 
                                  ? 'bg-secondary/50 text-secondary-foreground rounded-tl-none min-w-[60px] min-h-[40px]' 
                                  : 'bg-secondary text-secondary-foreground rounded-tl-none'
                              }
                            `}
                          >
                            {message.isTyping ? (
                              <div className="flex space-x-1 items-center justify-center h-full">
                                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                            ) : (
                              <div>
                                <div className="whitespace-pre-line">{message.content}</div>
                                {message.sender === 'assistant' && message.model && (
                                  <div className="mt-2 flex justify-between items-center">
                                    <div className="text-xs opacity-70">
                                      {getModelBadge(message.model)}
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => copyToClipboard(message.content)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 mx-1">
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                        
                        {message.sender === 'user' && (
                          <div className="ml-3 mt-1">
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                              <User className="h-4 w-4 text-secondary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input area */}
            <div className="border-t border-border bg-background p-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span>Model:</span>
                      <Select
                        value={selectedModel}
                        onValueChange={setSelectedModel}
                      >
                        <SelectTrigger className="h-7 w-40 ml-2 text-xs border-none">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map(model => (
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
                      className="self-end h-[60px] w-[60px] rounded-full shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={!inputMessage.trim() || isSending}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
            <p className="text-muted-foreground mb-4">
              Select an existing conversation or start a new one
            </p>
            <Button onClick={handleNewChat}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
