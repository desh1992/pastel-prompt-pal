import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gradient mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join Prompt Pal and explore AI-powered tools
            <span className="flex items-center justify-center gap-1 text-xs mt-1">
              <img src="/public/cyquent-logo.png" alt="Cyquent" className="h-4 w-auto" />
              Product of Cyquent Inc
            </span>
          </p>
        </div>
        
        <div className="bg-card border border-border shadow-soft rounded-2xl p-8 mb-4">
          <SignupForm />
        </div>
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account?</span>{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
