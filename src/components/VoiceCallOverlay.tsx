import React from 'react';
import { Mic, MicOff, Phone } from 'lucide-react';

interface VoiceCallOverlayProps {
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onEndCall: () => void;
}

const VoiceCallOverlay: React.FC<VoiceCallOverlayProps> = ({
  isActive,
  isMuted,
  onToggleMute,
  onEndCall,
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 
      border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Voice Call Active
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-full ${
              isMuted 
                ? 'bg-gray-200 dark:bg-gray-700' 
                : 'bg-teal-100 dark:bg-teal-900'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Mic className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            )}
          </button>
          
          <button
            onClick={onEndCall}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallOverlay; 