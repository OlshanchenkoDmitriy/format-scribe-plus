import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TextStats } from "@/components/TextStats";
import { BasicActions } from "@/components/BasicActions";
import { SymbolActions } from "@/components/SymbolActions";
import { FrequentActions } from "@/components/FrequentActions";
import { EnhancedTextStats } from "@/components/EnhancedTextStats";
import { SearchReplace } from "@/components/SearchReplace";
import { SunoEditor } from "@/components/SunoEditor";
import { HistoryManager } from "@/components/HistoryManager";
import { MobileNavigation } from "@/components/MobileNavigation";
import { VoiceInput } from "@/components/VoiceInput";
import { useTextHistory } from "@/hooks/useTextHistory";
import { FileText } from "lucide-react";

const Index = () => {
  const { text, setText, undo, redo, canUndo, canRedo } = useTextHistory();
  const [voiceText, setVoiceText] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [sunoText, setSunoText] = useState('');
  const { toast } = useToast();

  // Save to history when text changes
  useEffect(() => {
    if (text.trim() && (window as any).saveToHistory) {
      const timeoutId = setTimeout(() => {
        (window as any).saveToHistory(text, activeTab === 'suno' ? 'suno' : 'editor');
      }, 2000); // Debounce saves
      
      return () => clearTimeout(timeoutId);
    }
  }, [text, activeTab]);

  const handleLoadFromHistory = (loadedText: string) => {
    if (activeTab === 'suno') {
      setSunoText(loadedText);
    } else {
      setText(loadedText);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'voice':
        return (
          <div className="p-4 space-y-4">
            <div className="space-y-4">
              <div className="p-6 bg-gradient-voice/10 rounded-lg border border-[hsl(120_60%_50%_/_0.3)]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h2 className="text-xl font-bold">Голосовой ввод</h2>
                  <VoiceInput onTextReceived={setVoiceText} />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Поддержка русского и английского языков. Говорите естественно.
                </p>
                
                <Textarea
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  placeholder="Распознанный текст появится здесь..."
                  className="min-h-[300px] bg-editor-bg border-editor-border text-foreground resize-none text-sm leading-relaxed shadow-card w-full"
                />
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setText(voiceText);
                      toast({ description: "Текст сохранен в редактор" });
                    }}
                    className="bg-action-button hover:bg-action-button-hover"
                  >
                    Сохранить в редактор
                  </Button>
                  <Button
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(voiceText);
                      toast({ description: "Текст скопирован в буфер обмена" });
                    }}
                    className="bg-action-button hover:bg-action-button-hover"
                  >
                    Копировать
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setVoiceText('');
                      toast({ description: "Текст очищен" });
                    }}
                    className="bg-action-button hover:bg-action-button-hover"
                  >
                    Очистить
                  </Button>
                </div>
              </div>
            </div>
            <EnhancedTextStats text={voiceText} />
          </div>
        );

      case 'suno':
        return (
          <div className="p-4">
            <SunoEditor text={sunoText} onTextChange={setSunoText} />
          </div>
        );

      case 'history':
        return (
          <div className="p-4">
            <HistoryManager onLoadText={handleLoadFromHistory} />
          </div>
        );

      case 'settings':
        return (
          <div className="p-4 space-y-4">
            <EnhancedTextStats text={text} />
            <SearchReplace text={text} onTextChange={setText} />
          </div>
        );

      default: // editor
        return (
          <>
            <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
              {/* Main Panel - Text Area */}
              <div className="flex-1 flex flex-col p-4">
                <div className="flex-1 space-y-3">
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Вставьте или введите ваш текст здесь..."
                    className="min-h-full bg-editor-bg border-editor-border text-foreground resize-none text-sm leading-relaxed shadow-card w-full"
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <TextStats text={text} />
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

              {/* Right Panel - Tools (Hidden on mobile) */}
              <div className="hidden md:block w-80 border-l border-editor-border bg-card/30 overflow-y-auto">
                <div className="p-4 space-y-4">
                  <SearchReplace text={text} onTextChange={setText} />
                  <SymbolActions text={text} onTextChange={setText} />
                  <FrequentActions text={text} onTextChange={setText} />
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Header */}
      <div className="border-b border-editor-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Text Formatter Pro</h1>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'voice' && 'Голосовой ввод и обработка'}
                {activeTab === 'suno' && 'Редактор песен и структур'}
                {activeTab === 'history' && 'История обработанных текстов'}
                {activeTab === 'settings' && 'Расширенная статистика и настройки'}
                {activeTab === 'editor' && 'Мощный редактор для обработки текста'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Mobile Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
