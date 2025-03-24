import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, PenSquare, Brain, MessageSquare, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { name: 'Home', path: '/home', icon: null },
    { name: 'Analysis', path: '/analysis', icon: Brain },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Editor', path: '/editor', icon: PenSquare },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Link 
            to="/home" 
            className="flex items-center gap-2 text-xl font-semibold tracking-tight hover:opacity-90 transition-opacity"
          >
            <span className="text-gradient">Prompt Pal</span>
            {/* <span className="text-xs ml-2 text-muted-foreground">Powered by Cyquent AI</span> */}
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-full ${
                isActive(item.path)
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted'
              }`}
            >
              <span className="flex items-center gap-2">
                {item.icon && <item.icon size={16} />}
                {item.name}
              </span>
            </Link>
          ))}
          
          <Link to="/profile">
            <Avatar className="h-9 w-9 transition-transform hover:scale-105">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary">
                <User size={18} />
              </AvatarFallback>
            </Avatar>
          </Link>
        </nav>
        
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <nav className="grid gap-2 p-4 border-t border-border">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-foreground/70'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && <item.icon size={18} />}
                {item.name}
              </Link>
            ))}
            
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User size={14} />
                </AvatarFallback>
              </Avatar>
              Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
