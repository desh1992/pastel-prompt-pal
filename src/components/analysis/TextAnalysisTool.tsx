
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, BrainCircuit, CircleDashed, BarChart3, Sparkles, FileText, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { HighlightedTextInput, HighlightSegment } from '@/components/analysis/HighlightedTextInput';

type MetricType = 'reasoning' | 'factual' | 'creativity' | 'conciseness' | 'relevance';

interface AnalysisMetric {
  name: MetricType;
  score: number;
  model: string;
  color: string;
  icon: React.ElementType;
  description: string;
}

const TextAnalysisTool = () => {
  const [inputText, setInputText] = useState('');
  const [instruction, setInstruction] = useState('');
  const [instructionError, setInstructionError] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [questionAsked, setQuestionAsked] = useState(false); // Track if instruction has been submitted
  const [highlights, setHighlights] = useState<HighlightSegment[]>([]);

  const { toast } = useToast();
  
  const [metrics, setMetrics] = useState<AnalysisMetric[]>([
    {
      name: 'reasoning',
      score: 0,
      model: 'gpt-4o',
      color: 'from-blue-500 to-cyan-400',
      icon: Brain,
      description: 'Logical coherence and structured thinking',
    },
    {
      name: 'factual',
      score: 0,
      model: 'gpt-4o-mini',
      color: 'from-green-500 to-emerald-400',
      icon: Check,
      description: 'Accuracy and correctness of information',
    },
    {
      name: 'creativity',
      score: 0,
      model: 'claude-3',
      color: 'from-purple-500 to-pink-400',
      icon: Sparkles,
      description: 'Originality and innovative thinking',
    },
    {
      name: 'conciseness',
      score: 0,
      model: 'gpt-4o-mini',
      color: 'from-yellow-500 to-amber-400',
      icon: FileText,
      description: 'Brevity and clarity of expression',
    },
    {
      name: 'relevance',
      score: 0,
      model: 'gpt-4o',
      color: 'from-red-500 to-rose-400',
      icon: BarChart3,
      description: 'Pertinence to the topic or question',
    },
  ]);

  const sampleSegments = inputText.split('. ').map((sentence, i) => ({
    text: sentence + (i < inputText.length - 1 ? '. ' : ''),
    metric: metrics[i % metrics.length].name, // Rotate
  }));
  
  useEffect(() => {
    if (analysisComplete && !questionAsked) {
      const segments = inputText.split('. ').map((sentence, i) => ({
        text: sentence + (i < inputText.length - 1 ? '. ' : ''),
        metric: metrics[i % metrics.length].name, // rotate
      }));
      setHighlights(segments);
    }
  }, [analysisComplete, inputText, metrics, questionAsked]);
  
  const handleModelChange = (model: string, metricName: MetricType) => {
    setMetrics(prevMetrics => 
      prevMetrics.map(metric => 
        metric.name === metricName ? { ...metric, model } : metric
      )
    );
  };
  
  const handleAnalyze = () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }
  
    // 👇 If already analyzed and now submitting a question
    if (analysisComplete && !questionAsked) {
      if (!instruction.trim()) {
        setInstructionError("Instruction is required.");
        return;
      }
      setInstructionError('');
      setQuestionAsked(true);
    
      // Simulate LLM-enhanced response or replace with real API call
      const refined = `Following instruction: "${instruction}", the text has been improved for clarity and relevance.`;
    
      setInputText(refined);
      setOutputText(refined); // (optional) if you still use it elsewhere
      setHighlights([]); // reset highlights
    
      handleSave(); // ✅ Auto save to history
    
      // Reset to allow a new analysis round
      setInstruction('');
      setAnalysisComplete(false);
      setQuestionAsked(false);
      toast({
        title: "Instruction applied",
        description: "Enhanced version saved. You can analyze again.",
      });
      return;
    }
    
  
    // 👇 Initial analysis
    setIsAnalyzing(true);
    setShowStats(false);
    setAnalysisComplete(false);
    setInstruction('');
    setInstructionError('');
    setQuestionAsked(false);
  
    setTimeout(() => {
      const updatedMetrics = metrics.map(metric => ({
        ...metric,
        score: Math.floor(Math.random() * 41) + 60,
      }));
      setMetrics(updatedMetrics);
      setShowStats(true);
  
      setTimeout(() => {
        setOutputText(
          inputText +
          "\n\nThis is an AI-enhanced version of your text. The content has been refined for clarity, accuracy, and style based on the analysis."
        );
        setIsAnalyzing(false);
        setAnalysisComplete(true);
  
        toast({
          title: "Analysis complete",
          description: "You can now ask a follow-up question.",
        });
      }, 1500);
    }, 2000);
  };
  
  
  const handleReset = () => {
    setInputText('');
    setInstruction('');
    setInstructionError('');
    setOutputText('');
    setShowStats(false);
    setAnalysisComplete(false);
    setQuestionAsked(false);
    setMetrics(metrics.map(metric => ({ ...metric, score: 0 })));
  };
  
  
  const handleSave = () => {
    // In a real app, this would save to your history or export the file
    toast({
      title: "Analysis saved",
      description: "Your analysis has been saved to history.",
    });

    setInstruction('');
    setInstructionError('');
    setQuestionAsked(false);
    setAnalysisComplete(false);
    setHighlights([]); // clear highlights so re-analyze will generate fresh ones
  };
  
  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto animate-fade-in">
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Text Analysis Tool</h1>
        <p className="text-muted-foreground">
          Analyze and enhance your text with AI
        </p>
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Input Text</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={isAnalyzing}
              >
                Clear
              </Button>
            </div>
            <HighlightedTextInput
              value={inputText}
              onChange={setInputText}
              highlights={analysisComplete ? highlights : []}
              disabled={isAnalyzing || questionAsked}
            />

            {analysisComplete && !questionAsked && (
              <div className="space-y-2">
                <label htmlFor="instruction" className="text-sm font-medium">
                  Instruction
                </label>
                <Textarea
                  id="instruction"
                  placeholder="E.g., Make this more concise, Convert to professional tone, Fix grammar errors..."
                  className="resize-none h-20 text-base"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  disabled={isAnalyzing}
                />
                {instructionError && <p className="text-red-500 text-sm mt-1">{instructionError}</p>}
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              className="w-full btn-primary h-12"
              disabled={isAnalyzing || !inputText.trim()}
            >
              {isAnalyzing ? (
                <>
                  <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  {analysisComplete && !questionAsked ? "Ask Your Question" : "Analyze Text"}
                </>
              )}
            </Button>
            
          </div>
        </div>

        <div className={`lg:col-span-1 transition-all duration-500 ${showStats ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          <div className="sticky top-24 rounded-2xl border p-6 bg-card shadow-soft">
            <h2 className="text-xl font-medium mb-6">Analysis Metrics</h2>
            
            <div className="space-y-6">
              {metrics.map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <metric.icon className="h-5 w-5" />
                      <span className="font-medium capitalize">{metric.name}</span>
                    </div>
                    <span className="text-xl font-semibold">{metric.score}%</span>
                  </div>
                  
                  <Progress 
                    value={metric.score} 
                    className="h-2"
                    indicatorClassName={`bg-gradient-to-r ${metric.color}`}
                  />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{metric.description}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-xs font-medium">Recommended model:</span>
                    <Select
                      value={metric.model}
                      onValueChange={(value) => handleModelChange(value, metric.name)}
                      disabled={isAnalyzing}
                    >
                      <SelectTrigger className="h-8 w-36">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                        <SelectItem value="llama-3">Llama 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextAnalysisTool;
