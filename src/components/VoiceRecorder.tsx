import React, { useState, useRef, useCallback } from 'react';
import { Mic } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  maxDuration?: number;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onRecordingComplete,
  maxDuration = 60 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Handle recording logic
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="p-2 rounded-full bg-red-500 hover:bg-red-600"
      >
        <Mic className={`w-5 h-5 text-white ${isRecording ? 'animate-pulse' : ''}`} />
      </button>
      {isRecording && (
        <span className="text-sm text-gray-500">
          {formatDuration(duration)}
        </span>
      )}
    </div>
  );
}; 