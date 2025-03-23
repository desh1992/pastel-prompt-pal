import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PenLine, CircleDashed, Save, ArrowLeft, ArrowRight, Undo, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const models = [
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable model for complex tasks' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Balanced performance and speed' },
  { id: 'claude-3', name: 'Claude 3', description: 'Excellent for creative writing and nuance' },
  { id: 'llama-3', name: 'Llama 3', description: 'Fast processing for shorter content' },
];

const promptTemplates = [
  { id: 'improve', name: 'Improve Writing', prompt: 'Improve this text by enhancing clarity, flow, and style while maintaining the original message and tone.' },
  { id: 'academic', name: 'Academic Style', prompt: 'Rewrite this in formal academic style with proper citations and scholarly tone.' },
  { id: 'simplify', name: 'Simplify', prompt: 'Simplify this text to make it more accessible, using shorter sentences and simpler vocabulary.' },
  { id: 'creative', name: 'Creative Rewrite', prompt: 'Rewrite this text in a more creative and engaging way, using vivid language and imagery.' },
  { id: 'professional', name: 'Professional', prompt: 'Rewrite this for a professional business context, focusing on clarity and impact.' },
];

const TextEditor = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [selectedPrompt, setSelectedPrompt] = useState('improve');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<{input: string, output: string, prompt: string, model: string}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const { toast } = useToast();
  
  const handleGenerate = () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to edit.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Get the active prompt
    const promptText = selectedPrompt === 'custom' 
      ? customPrompt 
      : promptTemplates.find(p => p.id === selectedPrompt)?.prompt || '';
    
    // Simulate processing
    setTimeout(() => {
      // For demo, just modify the text
      const newOutput = `${inputText}\n\n[Edited with ${models.find(m => m.id === selectedModel)?.name || selectedModel}]\n\n` + 
        "This is an AI-enhanced version of your text based on the prompt. The content has been refined to follow your specific instructions while maintaining your original meaning.";
      
      setOutputText(newOutput);
      setIsProcessing(false);
      
      // Add to history
      const newHistoryEntry = {
        input: inputText,
        output: newOutput,
        prompt: promptText,
        model: selectedModel
      };
      
      setHistory(prev => [newHistoryEntry, ...prev]);
      setHistoryIndex(-1);
      
      toast({
        title: "Text generated",
        description: `Generated using ${models.find(m => m.id === selectedModel)?.name}`,
      });
    }, 2000);
  };
  
  const handleSave = () => {
    // In a real app, this would save to your history or export the file
    toast({
      title: "Document saved",
      description: "Your document has been saved to history.",
    });
  };
  
  const handleExport = () => {
    // Create a download link
    const element = document.createElement('a');
    const file = new Blob([outputText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `generated-text-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Document exported",
      description: "Your document has been exported as a text file.",
    });
  };
  
  const navigateHistory = (direction: 'prev' | 'next') => {
    if (history.length === 0) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = historyIndex === -1 ? 0 : Math.min(historyIndex + 1, history.length - 1);
    } else {
      newIndex = Math.max(historyIndex - 1, -1);
    }
    
    setHistoryIndex(newIndex);
    
    if (newIndex === -1) {
      // Reset to current state
      setInputText('');
      setOutputText('');
    } else {
      // Load from history
      const historyItem = history[newIndex];
      setInputText(historyItem.input);
      setOutputText(historyItem.output);
      
      // Find the prompt template or set as custom
      const matchingPrompt = promptTemplates.find(p => p.prompt === historyItem.prompt);
      if (matchingPrompt) {
        setSelectedPrompt(matchingPrompt.id);
        setCustomPrompt('');
      } else {
        setSelectedPrompt('custom');
        setCustomPrompt(historyItem.prompt);
      }
      
      setSelectedModel(historyItem.model);
    }
  };
  
  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto animate-fade-in">
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AI Text Editor</h1>
        <p className="text-muted-foreground">
          Write, edit, and enhance your text with AI assistance
        </p>
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border border-border shadow-soft h-fit">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Input</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={history.length === 0 || historyIndex === history.length - 1}
                  onClick={() => navigateHistory('prev')}
                  title="Previous version"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={historyIndex <= 0}
                  onClick={() => navigateHistory('next')}
                  title="Next version"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputText('');
                    setHistoryIndex(-1);
                  }}
                  title="Clear input"
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea
              placeholder="Enter or paste your text here..."
              className="min-h-[300px] p-4 resize-y text-base"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isProcessing}
            />
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Select Model
                </label>
                <Select
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                  disabled={isProcessing}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        <div>
                          <span>{model.name}</span>
                          <p className="text-xs text-muted-foreground">{model.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Editing Instructions
                </label>
                <Tabs value={selectedPrompt} onValueChange={setSelectedPrompt}>
                <TabsList 
                  className="flex flex-wrap w-full gap-2 justify-start p-2 rounded-md bg-muted/50 min-h-[auto] mb-4"
                  style={{alignItems: 'flex-start' }}
                >
                  {[...promptTemplates, { id: 'custom', name: 'Custom', prompt: '' }].map(template => (
                    <TabsTrigger
                      key={template.id}
                      value={template.id}
                      className="text-xs px-3 py-1 rounded whitespace-nowrap bg-white"
                    >
                      {template.name}
                    </TabsTrigger>                  
                  ))}
                </TabsList>
                  {promptTemplates.map(template => (
                    <TabsContent key={template.id} value={template.id} className="mt-0">
                      <p className="text-sm text-muted-foreground italic border-l-2 border-primary/20 pl-3 py-1">
                        {template.prompt}
                      </p>
                    </TabsContent>
                  ))}
                  
                  <TabsContent value="custom" className="mt-0">
                    <Textarea
                      placeholder="Enter custom instructions for the AI..."
                      className="min-h-[100px] resize-none"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      disabled={isProcessing}
                    />
                  </TabsContent>
                </Tabs>
              </div>
              
              <Button
                onClick={handleGenerate}
                className="w-full btn-primary h-12"
                disabled={isProcessing || !inputText.trim() || (selectedPrompt === 'custom' && !customPrompt.trim())}
              >
                {isProcessing ? (
                  <>
                    <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <PenLine className="mr-2 h-5 w-5" />
                    Generate Text
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-card border border-border shadow-soft h-fit">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Output</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={!outputText}
                  title="Save to history"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={!outputText}
                  title="Export as file"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className={`min-h-[300px] rounded-md border border-input bg-transparent p-4 ${outputText ? 'text-base' : 'text-muted-foreground text-sm italic'}`}>
              {outputText || "Generated text will appear here..."}
            </div>
            
            <div className="flex space-x-4 text-sm">
              <div className="flex-1">
                <span className="text-xs text-muted-foreground">Model:</span>
                <p className="font-medium">
                  {models.find(m => m.id === selectedModel)?.name || selectedModel}
                </p>
              </div>
              
              <div className="flex-1">
                <span className="text-xs text-muted-foreground">Prompt:</span>
                <p className="font-medium truncate">
                  {selectedPrompt === 'custom' 
                    ? 'Custom Prompt' 
                    : promptTemplates.find(p => p.id === selectedPrompt)?.name}
                </p>
              </div>
              
              {historyIndex !== -1 && (
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground">Version:</span>
                  <p className="font-medium">
                    {history.length - historyIndex} of {history.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TextEditor;
