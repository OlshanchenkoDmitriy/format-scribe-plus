import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onTextReceived: (text: string) => void;
  append?: boolean;
}

export const VoiceInput = ({ onTextReceived, append = false }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'ru-RU' | 'en-US'>('ru-RU');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const accumulatedTextRef = useRef<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ru-RU'; // Start with Russian

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          accumulatedTextRef.current += finalTranscript + ' ';
          onTextReceived(accumulatedTextRef.current);
        } else if (interimTranscript) {
          // Show interim results in real-time
          onTextReceived(accumulatedTextRef.current + interimTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          description: "Ошибка распознавания речи",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    }
  }, [onTextReceived, toast]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      try {
        accumulatedTextRef.current = '';
        recognitionRef.current.start();
        setIsRecording(true);
        toast({
          description: "Голосовой ввод начат (RU/EN)",
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          description: "Не удалось начать голосовой ввод",
          variant: "destructive",
        });
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast({
        description: "Голосовой ввод остановлен",
      });
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={isRecording ? stopRecording : startRecording}
      className={`${isRecording 
        ? 'bg-gradient-voice text-white shadow-voice animate-pulse' 
        : 'bg-action-button hover:bg-action-button-hover'
      } transition-all duration-300`}
    >
      {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};