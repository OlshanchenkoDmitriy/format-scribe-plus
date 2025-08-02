import { Button } from "@/components/ui/button";
import { Clipboard, Copy, Eraser, Undo, Redo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VoiceInput } from "./VoiceInput";

interface BasicActionsProps {
  text: string;
  onTextChange: (text: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const BasicActions = ({ 
  text, 
  onTextChange, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo 
}: BasicActionsProps) => {
  const { toast } = useToast();

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      onTextChange(clipboardText);
      toast({
        description: "Текст вставлен из буфера обмена",
      });
    } catch (error) {
      toast({
        description: "Не удалось получить доступ к буферу обмена",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: "Текст скопирован в буфер обмена",
      });
    } catch (error) {
      toast({
        description: "Не удалось скопировать текст",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    onTextChange("");
    toast({
      description: "Текст очищен",
    });
  };

  const handleVoiceText = (voiceText: string) => {
    const currentText = text;
    const newText = currentText ? currentText + ' ' + voiceText : voiceText;
    onTextChange(newText);
  };

  return (
    <div className="flex gap-2 p-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={handlePaste}
        className="bg-action-button hover:bg-action-button-hover"
      >
        <Clipboard className="h-4 w-4" />
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        onClick={handleCopy}
        disabled={!text}
        className="bg-action-button hover:bg-action-button-hover"
      >
        <Copy className="h-4 w-4" />
      </Button>
      
      <VoiceInput onTextReceived={handleVoiceText} append={true} />
      
      <Button
        variant="secondary"
        size="sm"
        onClick={handleClear}
        disabled={!text}
        className="bg-action-button hover:bg-action-button-hover"
      >
        <Eraser className="h-4 w-4" />
      </Button>
      
      <div className="w-px bg-border mx-1" />
      
      <Button
        variant="secondary"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className="bg-action-button hover:bg-action-button-hover"
      >
        <Undo className="h-4 w-4" />
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        className="bg-action-button hover:bg-action-button-hover"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};