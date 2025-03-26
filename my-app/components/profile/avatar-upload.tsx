"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { doc, updateDoc } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import { Camera, Loader2 } from "lucide-react"

interface AvatarUploadProps {
  userId: string
  currentAvatar?: string
  currentName: string
  onAvatarUpdate: (newAvatarUrl: string) => void
}

export function AvatarUpload({
  userId,
  currentAvatar,
  currentName,
  onAvatarUpdate,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file.',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsUploading(true)
      const timestamp = Date.now()
      const storageRef = ref(storage, `avatars/${userId}/${timestamp}_${file.name}`)
      
      // Upload file
      await uploadBytes(storageRef, file)
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)
      
      // Update user document in Firestore
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        avatar: downloadURL
      })

      // Update local state
      onAvatarUpdate(downloadURL)

      toast({
        title: 'Success',
        description: 'Profile picture updated successfully.',
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload profile picture. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentAvatar} />
          <AvatarFallback>{currentName[0]}</AvatarFallback>
        </Avatar>
        <Label
          htmlFor="avatar-upload"
          className={`absolute bottom-0 right-0 bg-background border rounded-full p-1.5 cursor-pointer hover:bg-accent ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={isUploading}
          />
        </Label>
      </div>
      <p className="text-sm text-muted-foreground">
        {isUploading ? 'Uploading...' : 'Click the camera icon to upload a new profile picture'}
      </p>
    </div>
  )
} 