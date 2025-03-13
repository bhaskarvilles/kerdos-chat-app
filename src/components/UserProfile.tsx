import React, { useState, useEffect } from 'react';
import { User, UserPreferences } from '../types';
import { Settings, User as UserIcon, Shield, Crown, Mail, Calendar, LogOut, X } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardFooter } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

interface UserProfileProps {
  user: User;
  isPaidUser?: boolean;
  preferences?: UserPreferences;
  onUpdateProfile?: (updates: Partial<User>) => void;
  onOpenSettings?: () => void;
  onSignOut?: () => void;
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isPaidUser = user?.subscription?.tier === 'premium',
  preferences,
  onUpdateProfile,
  onOpenSettings,
  onSignOut,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(editedUser);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (!onClose) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // If this is being rendered inside another component without a modal
  if (!onClose)
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.username}</h2>
              <Badge variant={isPaidUser ? "default" : "secondary"}>
                {isPaidUser ? 'Premium' : 'Free'} User
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
          )}
          
          {user.joinDate && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span>Joined {formatDate(user.joinDate)}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span>Account expires {new Date(user.expirationTime).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    );

  // Modal version
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="relative h-32 bg-gradient-to-r from-teal-500 to-emerald-500">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>
          
          {isPaidUser && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 hover:bg-yellow-400"
            >
              <Crown className="w-4 h-4 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="px-6 pt-0 pb-6 -mt-16">
            <div className="flex justify-between items-end mb-6">
              <div className="flex items-end">
                <div className="w-24 h-24 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden">
                  <UserIcon className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="ml-4 mb-2">
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  {user.email && <p className="text-muted-foreground">{user.email}</p>}
                </div>
              </div>
              
              <Button
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="text-primary hover:text-primary/80"
              >
                Edit
              </Button>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedUser.email || ''}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  {user.joinDate && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <span>Joined {formatDate(user.joinDate)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <span>Account expires {new Date(user.expirationTime).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={onOpenSettings}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={onSignOut}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile; 