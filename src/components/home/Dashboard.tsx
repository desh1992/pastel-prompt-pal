
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Brain, MessageSquare, PenSquare, History } from 'lucide-react';

const Dashboard = () => {
  const features = [
    {
      title: 'Text Analysis',
      description: 'Analyze text with AI to get insights on reasoning, factual accuracy, creativity, and more.',
      icon: Brain,
      color: 'bg-gradient-lavender',
      link: '/analysis',
    },
    {
      title: 'Chat Assistant',
      description: 'Chat with an AI assistant that can answer questions, provide guidance, and help you with your tasks.',
      icon: MessageSquare,
      color: 'bg-gradient-peach',
      link: '/chat',
    },
    {
      title: 'Text Editor',
      description: 'Edit and enhance your text with AI suggestions and improvements.',
      icon: PenSquare,
      color: 'bg-gradient-mint',
      link: '/editor',
    },
    {
      title: 'History',
      description: 'View and manage your past interactions with the AI tools.',
      icon: History,
      color: 'bg-gradient-sky',
      link: '/history',
    },
  ];

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto animate-fade-in">
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gradient">
          Welcome to Prompt Pal
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your AI companion for text analysis, chat assistance, and content creation
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`h-2 w-full ${feature.color}`}></div>
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className={`p-3 rounded-xl ${feature.color} bg-opacity-20 mr-4`}>
                  <feature.icon className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
              <Link to={feature.link}>
                <Button className="w-full btn-primary group-hover:translate-y-0 translate-y-1 transition-transform">
                  Go to {feature.title}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </section>

      <section className="rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10">
        <div className="p-8 md:p-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">
              Explore the power of AI to analyze, generate, and enhance your content with just a few clicks.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/analysis">
                <Button className="btn-primary">
                  <Brain className="mr-2 h-5 w-5" />
                  Try Text Analysis
                </Button>
              </Link>
              <Link to="/chat">
                <Button className="btn-secondary">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Start a Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
