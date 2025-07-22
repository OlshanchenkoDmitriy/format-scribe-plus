import { Textarea } from "@/components/ui/textarea";
import { TextStats } from "@/components/TextStats";
import { BasicActions } from "@/components/BasicActions";
import { SymbolActions } from "@/components/SymbolActions";
import { FrequentActions } from "@/components/FrequentActions";
import { useTextHistory } from "@/hooks/useTextHistory";
import { FileText } from "lucide-react";

const Index = () => {
  const { text, setText, undo, redo, canUndo, canRedo } = useTextHistory();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-editor-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Text Formatter Pro</h1>
              <p className="text-sm text-muted-foreground">Мощный редактор для обработки текста</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Text Area */}
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 space-y-3">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Вставьте или введите ваш текст здесь..."
              className="min-h-full bg-editor-bg border-editor-border text-foreground resize-none text-sm leading-relaxed shadow-card"
            />
            <div className="flex justify-between items-center">
              <TextStats text={text} />
              {/* Basic Actions */}
              <BasicActions
                text={text}
                onTextChange={setText}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Tools */}
        <div className="w-80 border-l border-editor-border bg-card/30 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Symbol Actions */}
            <SymbolActions text={text} onTextChange={setText} />

            {/* Frequent Actions */}
            <FrequentActions text={text} onTextChange={setText} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
