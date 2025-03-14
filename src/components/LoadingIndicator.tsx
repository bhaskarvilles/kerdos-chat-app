import React from 'react'

const SkeletonContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start space-x-4 p-4 animate-pulse">
    {children}
  </div>
)

const AvatarSkeleton = () => (
  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
)

const ContentSkeleton = () => (
  <div className="flex-1 space-y-2">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
  </div>
)

const TimestampSkeleton = () => (
  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
)

const MessageSkeleton = () => (
  <SkeletonContainer>
    <AvatarSkeleton />
    <ContentSkeleton />
    <TimestampSkeleton />
  </SkeletonContainer>
)

const LoadingIndicator: React.FC = () => {
  return (
    <div className="space-y-4">
      <MessageSkeleton />
      <MessageSkeleton />
      <MessageSkeleton />
      <MessageSkeleton />
      <MessageSkeleton />
    </div>
  )
}

export default LoadingIndicator
