
import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, just navigate to home
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/home');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in space-y-5 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`input-primary w-full h-12 ${
              errors.email ? 'border-red-300 focus-visible:ring-red-500' : ''
            }`}
            autoComplete="email"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm animate-fade-in">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`input-primary w-full pr-10 h-12 ${
              errors.password ? 'border-red-300 focus-visible:ring-red-500' : ''
            }`}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff size={18} className="text-muted-foreground" />
            ) : (
              <Eye size={18} className="text-muted-foreground" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm animate-fade-in">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="remember" className="text-sm text-muted-foreground">
            Remember me
          </label>
        </div>
        <a href="#" className="text-sm font-medium text-primary hover:underline">
          Forgot password?
        </a>
      </div>

      <Button 
        type="submit" 
        className="btn-primary w-full h-12 group" 
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            <span className="ml-2">Logging in...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <LogIn size={18} className="mr-2" />
            <span>Sign in</span>
            <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
