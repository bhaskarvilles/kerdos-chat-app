'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { deleteUser, getAuth } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AvatarUpload } from '@/components/profile/avatar-upload';
import { PasswordChangeDialog } from '@/components/profile/password-change-dialog';

export default function ProfilePage() {
  const { user, setUser, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  // Update newName when user changes
  useEffect(() => {
    if (user?.name) {
      setNewName(user.name);
    }
  }, [user?.name]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      await updateUserProfile(newName);

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    if (!user) return;
    setUser({
      ...user,
      avatar: newAvatarUrl
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('No user found');
      }

      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', user.id));
      
      // Delete user account
      await deleteUser(currentUser);

      toast({
        title: 'Account deleted',
        description: 'Your account has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Please sign in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile information and password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <AvatarUpload
              userId={user.id}
              currentAvatar={user.avatar}
              currentName={user.name}
              onAvatarUpdate={handleAvatarUpdate}
            />
            <div className="text-center">
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your name"
                disabled={isLoading}
              />
            </div>

            <Button 
              onClick={handleUpdateProfile} 
              disabled={isLoading || newName === user.name}
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-medium">Change Password</h3>
            <p className="text-sm text-muted-foreground">
              Update your password to keep your account secure.
            </p>
            <Button 
              onClick={() => setIsPasswordDialogOpen(true)}
              disabled={isLoading}
            >
              Change Password
            </Button>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button 
              onClick={handleDeleteAccount} 
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <PasswordChangeDialog
        isOpen={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      />
    </div>
  );
} 