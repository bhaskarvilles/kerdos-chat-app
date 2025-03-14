import React, { useState } from 'react';
import { User } from '../types';
import {
  Mail,
  Calendar,
  Shield,
  Settings,
  LogOut,
  Crown,
  Edit2,
  Save,
  X,
  MessageSquare,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface UserProfilePageProps {
  user: {
    username: string;
    email: string;
    joinDate?: Date;
    expirationTime: number;
    preferences: {
      notifications: boolean;
      language: string;
      timezone: string;
    };
    subscription?: {
      tier: 'free' | 'premium';
      expiresAt?: number;
      messageCount: number;
      lastResetTime: number;
    };
  };
  onUpdateProfile: (updates: Partial<User>) => void;
  onSignOut: () => void;
  onOpenSettings: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  onUpdateProfile,
  onSignOut,
  onOpenSettings,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [activeTab, setActiveTab] = useState("profile");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editedUser);
    setEditMode(false);
  };

  const handlePreferenceChange = (
    key: 'notifications' | 'language' | 'timezone',
    value: boolean | string
  ) => {
    setEditedUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const getSubscriptionStatus = () => {
    if (!user.subscription) return 'Free';
    return user.subscription.tier === 'premium' ? 'Premium' : 'Free';
  };

  const getMessageUsage = () => {
    if (!user.subscription) return 0;
    return user.subscription.tier === 'premium' ? 100 : (user.subscription.messageCount / 10) * 100;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-6">
        {/* Header Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10" />
          <CardContent className="relative pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Badge variant={user.subscription?.tier === 'premium' ? "default" : "secondary"}>
                <Crown className="w-4 h-4 mr-1" />
                {getSubscriptionStatus()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Profile Information</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={editedUser.username}
                        onChange={(e) => setEditedUser(prev => ({...prev, username: e.target.value}))}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser(prev => ({...prev, email: e.target.value}))}
                        disabled={!editMode}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">User Preferences</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about your account activity
                    </p>
                  </div>
                  <Switch
                    checked={editedUser.preferences.notifications}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                    disabled={!editMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={editedUser.preferences.language}
                    onValueChange={(value) => handlePreferenceChange('language', value)}
                    disabled={!editMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={editedUser.preferences.timezone}
                    onValueChange={(value) => handlePreferenceChange('timezone', value)}
                    disabled={!editMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Subscription Details</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Message Usage</Label>
                    <span className="text-sm text-muted-foreground">
                      {user.subscription?.messageCount || 0} / {user.subscription?.tier === 'premium' ? '∞' : '10'} messages
                    </span>
                  </div>
                  <Progress value={getMessageUsage()} />
                </div>

                {user.subscription?.tier === 'free' && (
                  <Alert>
                    <Crown className="h-4 w-4" />
                    <AlertTitle>Upgrade to Premium</AlertTitle>
                    <AlertDescription>
                      Get unlimited messages and access to premium features.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Payment Method
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Billing History
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Subscription FAQ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onOpenSettings}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={onSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <div>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              // Handle account deletion
              setShowDeleteDialog(false);
            }}>
              Delete Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfilePage; 