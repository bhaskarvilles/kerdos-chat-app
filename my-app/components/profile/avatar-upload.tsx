"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { doc, updateDoc } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { User } from "@/app/types/chat"

interface AvatarUploadProps {
  className?: string
}

export function AvatarUpload({ className }: AvatarUploadProps) {
  const { user, setUser } = useAuth()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return

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

    setIsUploading(true)

    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)

      // Upload to Firebase Storage
      const storageRef = ref(storage, `avatars/${user.id}/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadUrl = await getDownloadURL(storageRef)

      // Update user document in Firestore
      const userRef = doc(db, 'users', user.id)
      await updateDoc(userRef, {
        avatar: downloadUrl,
      })

      // Update local state
      setUser((prev: User | null) => prev ? { ...prev, avatar: downloadUrl } : null)

      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully.',
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload avatar. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={className}>
      <div className="relative group">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || user?.avatar || undefined} />
          <AvatarFallback>{user?.name?.[0] || '?'}</AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
          <Label htmlFor="avatar-upload" className="cursor-pointer">
            <Camera className="h-6 w-6 text-white" />
          </Label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={isUploading}
          />
        </div>
      </div>
      {isUploading && (
        <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
      )}
    </div>
  )
} 