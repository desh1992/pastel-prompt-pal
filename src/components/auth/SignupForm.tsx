
import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must include both letters and numbers';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      toast({
        title: "Account created successfully!",
        description: "Please log in with your new account.",
      });
      navigate('/login');
      setIsLoading(false);
    }, 1500);
  };

  const renderPasswordStrength = () => {
    if (!formData.password) return null;
    
    const strength = {
      length: formData.password.length >= 8,
      hasLetters: /[A-Za-z]/.test(formData.password),
      hasNumbers: /\d/.test(formData.password),
    };
    
    const strengthLevel = Object.values(strength).filter(Boolean).length;
    
    return (
      <div className="mt-2 space-y-2 animate-fade-in">
        <p className="text-sm font-medium">Password strength:</p>
        <div className="flex gap-2">
          <div 
            className={`h-1 flex-1 rounded-full ${
              strengthLevel >= 1 ? 'bg-red-500' : 'bg-gray-200'
            }`}
          ></div>
          <div 
            className={`h-1 flex-1 rounded-full ${
              strengthLevel >= 2 ? 'bg-yellow-500' : 'bg-gray-200'
            }`}
          ></div>
          <div 
            className={`h-1 flex-1 rounded-full ${
              strengthLevel >= 3 ? 'bg-green-500' : 'bg-gray-200'
            }`}
          ></div>
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <span className={`mr-2 ${strength.length ? 'text-green-500' : 'text-gray-400'}`}>
              {strength.length ? <Check size={14} /> : <AlertCircle size={14} />}
            </span>
            <span className={strength.length ? 'text-foreground' : 'text-muted-foreground'}>
              At least 8 characters
            </span>
          </div>
          <div className="flex items-center">
            <span className={`mr-2 ${strength.hasLetters && strength.hasNumbers ? 'text-green-500' : 'text-gray-400'}`}>
              {strength.hasLetters && strength.hasNumbers ? <Check size={14} /> : <AlertCircle size={14} />}
            </span>
            <span className={strength.hasLetters && strength.hasNumbers ? 'text-foreground' : 'text-muted-foreground'}>
              Letters and numbers
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in space-y-5 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
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
        {errors.email && (
          <p className="text-red-500 text-sm animate-fade-in">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="companyName" className="text-sm font-medium">
          Company Name
        </label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Your Company"
          className={`input-primary w-full h-12 ${
            errors.companyName ? 'border-red-300 focus-visible:ring-red-500' : ''
          }`}
          autoComplete="organization"
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm animate-fade-in">{errors.companyName}</p>
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
            autoComplete="new-password"
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
        {renderPasswordStrength()}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className={`input-primary w-full pr-10 h-12 ${
              errors.confirmPassword ? 'border-red-300 focus-visible:ring-red-500' : ''
            }`}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} className="text-muted-foreground" />
            ) : (
              <Eye size={18} className="text-muted-foreground" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm animate-fade-in">{errors.confirmPassword}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="btn-primary w-full h-12" 
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            <span className="ml-2">Creating Account...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <UserPlus size={18} className="mr-2" />
            <span>Create Account</span>
          </div>
        )}
      </Button>
    </form>
  );
};

export default SignupForm;
