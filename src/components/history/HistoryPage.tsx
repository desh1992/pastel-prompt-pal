import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SearchIcon, Clock, MessageSquare, FileText, Trash2, MoreVertical, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface HistoryItem {
  id: string;
  title: string;
  type: 'chat' | 'analysis' | 'editor';
  content: string;
  timestamp: Date;
  model: string;
}

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Sample data
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: '1',
      title: 'Website design discussion',
      type: 'chat',
      content: 'A chat conversation about website design principles and modern UI trends.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      model: 'gpt-4o',
    },
    {
      id: '2',
      title: 'Marketing copy analysis',
      type: 'analysis',
      content: 'Analysis of marketing copy for a new product launch, focusing on clarity and persuasiveness.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      model: 'claude-3',
    },
    {
      id: '3',
      title: 'Product description editing',
      type: 'editor',
      content: 'Enhancing product descriptions for an e-commerce website with more engaging language.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      model: 'gpt-4o-mini',
    },
    {
      id: '4',
      title: 'Customer support templates',
      type: 'editor',
      content: 'Creating and refining customer support response templates for common inquiries.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      model: 'gpt-4o',
    },
    {
      id: '5',
      title: 'Feature specification discussion',
      type: 'chat',
      content: 'Discussion about technical specifications for new product features.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      model: 'gpt-4o-mini',
    },
    {
      id: '6',
      title: 'Content engagement analysis',
      type: 'analysis',
      content: 'Analysis of blog post effectiveness and reader engagement metrics.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      model: 'claude-3',
    },
  ]);
  
  const filteredItems = historyItems
    .filter(item => {
      // Filter by active tab
      if (activeTab !== 'all' && item.type !== activeTab) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Less than 48 hours
    if (diff < 48 * 60 * 60 * 1000) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'analysis':
        return <SearchIcon className="h-5 w-5 text-purple-500" />;
      case 'editor':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };
  
  const handleDeleteItem = (id: string) => {
    setHistoryItems(historyItems.filter(item => item.id !== id));
    
    toast({
      description: "Item deleted from history",
    });
  };
  
  const handleClearHistory = () => {
    const typesToClear = activeTab === 'all' ? ['chat', 'analysis', 'editor'] : [activeTab];
    
    setHistoryItems(historyItems.filter(item => !typesToClear.includes(item.type)));
    
    toast({
      title: "History cleared",
      description: activeTab === 'all' ? "All history items cleared" : `${activeTab} history cleared`,
    });
  };
  
  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto animate-fade-in">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your History</h1>
        <p className="text-muted-foreground">
          View and manage your past activity
        </p>
      </section>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <TabsList>
            <TabsTrigger value="all" className="text-sm">All History</TabsTrigger>
            <TabsTrigger value="chat" className="text-sm">Chat</TabsTrigger>
            <TabsTrigger value="analysis" className="text-sm">Analysis</TabsTrigger>
            <TabsTrigger value="editor" className="text-sm">Editor</TabsTrigger>
          </TabsList>
          
          <div className="relative w-full sm:w-auto">
            <Input
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 w-full sm:w-[200px]"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <HistoryContent 
            items={filteredItems} 
            formatDate={formatDate} 
            getTypeIcon={getTypeIcon}
            onDelete={handleDeleteItem}
            onClearAll={handleClearHistory}
            type="all"
          />
        </TabsContent>
        
        <TabsContent value="chat" className="mt-0">
          <HistoryContent 
            items={filteredItems} 
            formatDate={formatDate} 
            getTypeIcon={getTypeIcon}
            onDelete={handleDeleteItem}
            onClearAll={handleClearHistory}
            type="chat"
          />
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-0">
          <HistoryContent 
            items={filteredItems} 
            formatDate={formatDate} 
            getTypeIcon={getTypeIcon}
            onDelete={handleDeleteItem}
            onClearAll={handleClearHistory}
            type="analysis"
          />
        </TabsContent>
        
        <TabsContent value="editor" className="mt-0">
          <HistoryContent 
            items={filteredItems} 
            formatDate={formatDate} 
            getTypeIcon={getTypeIcon}
            onDelete={handleDeleteItem}
            onClearAll={handleClearHistory}
            type="editor"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface HistoryContentProps {
  items: HistoryItem[];
  formatDate: (date: Date) => string;
  getTypeIcon: (type: string) => React.ReactNode;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  type: string;
}

const HistoryContent = ({ items, formatDate, getTypeIcon, onDelete, onClearAll, type }: HistoryContentProps) => {
  const isEmpty = items.length === 0;
  
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="relative w-20 h-20 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Clock className="h-10 w-10 text-primary animate-pulse-soft" />
        </div>
        <h3 className="text-xl font-medium mb-2">No history found</h3>
        <p className="text-muted-foreground max-w-md">
          {type === 'all' 
            ? "You don't have any history items yet. Start using the app to create history." 
            : `You don't have any ${type} history items yet.`}
        </p>
      </div>
    );
  }
  
  // Group items by date
  const groupedItems: { [key: string]: HistoryItem[] } = {};
  
  items.forEach(item => {
    const date = new Date(item.timestamp);
    const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
    
    if (!groupedItems[dateKey]) {
      groupedItems[dateKey] = [];
    }
    
    groupedItems[dateKey].push(item);
  });
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearAll}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>
      
      {Object.entries(groupedItems).map(([dateKey, dateItems]) => {
        const date = new Date(dateKey);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        let dateLabel = date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
        
        if (date.toDateString() === today.toDateString()) {
          dateLabel = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
          dateLabel = 'Yesterday';
        }
        
        return (
          <div key={dateKey} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{dateLabel}</h3>
            
            <div className="space-y-2">
              {dateItems.map((item) => (
                <Collapsible key={item.id} className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(item.type)}
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(item.timestamp)} • {item.model}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 ml-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Export</DropdownMenuItem>
                          <Separator />
                          <DropdownMenuItem 
                            onClick={() => onDelete(item.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-0 border-t">
                      <p className="text-sm text-muted-foreground">{item.content}</p>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="outline" size="sm">
                          Reuse
                        </Button>
                        <Button size="sm" className="btn-primary">
                          Open in {item.type === 'chat' ? 'Chat' : item.type === 'analysis' ? 'Analysis' : 'Editor'}
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryPage;
