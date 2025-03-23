
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { User, LogOut, Mail, Building, Camera, Loader2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { getUser, logoutUser } from '@/services/userService';

const ProfilePage = () => {
  const storedUser = getUser();
  const [userProfile, setUserProfile] = useState({
    email: storedUser?.email || '',
    companyName: storedUser?.companyName || '',
    avatarUrl: '',
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };
  
  const handleAvatarUpload = () => {
    // Simulate upload process
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    }, 1500);
  };
  
  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto animate-fade-in">
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1 flex flex-col items-center text-center">
          <div className="mb-6 relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={userProfile.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                <User size={40} />
              </AvatarFallback>
            </Avatar>
            
            <div className="absolute -bottom-2 -right-2">
              <Button
                size="icon"
                className="rounded-full h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleAvatarUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold">{userProfile.companyName}</h2>
          <p className="text-muted-foreground text-sm mb-6">{userProfile.email}</p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You'll need to log back in to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleLogout}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Log Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
        
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Account Information</h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                className="input-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                Company Name
              </label>
              <Input
                id="companyName"
                type="text"
                value={userProfile.companyName}
                onChange={(e) => setUserProfile({ ...userProfile, companyName: e.target.value })}
                className="input-primary"
              />
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="btn-primary">
                Save Changes
              </Button>
            </div>
          </form>
          
          <div className="border-t border-border mt-8 pt-8">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              Security
            </h3>
            
            <Button variant="outline" className="mb-6">
              Change Password
            </Button>
            
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="text-sm font-medium mb-2">App Permissions</h4>
              <p className="text-sm text-muted-foreground">
                This application has access to your profile information and content you create.
                No third-party integrations are currently enabled.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
