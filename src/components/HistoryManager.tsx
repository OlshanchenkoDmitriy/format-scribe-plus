import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search, Copy, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface HistoryItem {
  id: string;
  text: string;
  timestamp: Date;
  type: 'editor' | 'suno' | 'voice';
  preview: string;
}

interface HistoryManagerProps {
  onLoadText: (text: string) => void;
}

export const HistoryManager = ({ onLoadText }: HistoryManagerProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('text-formatter-history');
      if (saved) {
        const parsed = JSON.parse(saved).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(parsed.sort((a: HistoryItem, b: HistoryItem) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        ));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveToHistory = (text: string, type: 'editor' | 'suno' | 'voice') => {
    if (!text.trim()) return;

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      type,
      preview: text.slice(0, 100) + (text.length > 100 ? '...' : '')
    };

    const updatedHistory = [newItem, ...history].slice(0, 50); // Keep last 50 items
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem('text-formatter-history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const deleteItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('text-formatter-history', JSON.stringify(updatedHistory));
    toast({
      description: "Элемент удален из истории",
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('text-formatter-history');
    toast({
      description: "История очищена",
    });
  };

  const loadText = (item: HistoryItem) => {
    onLoadText(item.text);
    toast({
      description: "Текст загружен в редактор",
    });
  };

  const copyText = async (text: string) => {
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

  const filteredHistory = history.filter(item =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'voice': return 'bg-gradient-voice/20 text-[hsl(120_60%_50%)]';
      case 'suno': return 'bg-gradient-suno/20 text-[hsl(340_75%_55%)]';
      default: return 'bg-gradient-primary/20 text-primary';
    }
  };

  // Expose saveToHistory function globally for other components
  (window as any).saveToHistory = saveToHistory;

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-history/10 border-[hsl(200_60%_50%_/_0.3)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>История ({history.length})</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearHistory}
              disabled={history.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по истории..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {history.length === 0 ? 'История пуста' : 'Ничего не найдено'}
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((item) => (
            <Card key={item.id} className="hover:shadow-card transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(item.type)}>
                        {item.type === 'voice' ? 'Голос' : 
                         item.type === 'suno' ? 'Suno' : 'Редактор'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(item.timestamp, 'dd.MM.yyyy HH:mm', { locale: ru })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 truncate">
                      {item.preview}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyText(item.text)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadText(item)}
                    >
                      Загрузить
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {selectedItem && (
        <Card className="fixed inset-4 z-50 bg-card border-editor-border shadow-2xl overflow-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Просмотр текста</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Badge className={getTypeColor(selectedItem.type)}>
                {selectedItem.type === 'voice' ? 'Голос' : 
                 selectedItem.type === 'suno' ? 'Suno' : 'Редактор'}
              </Badge>
              <span className="text-sm text-muted-foreground ml-2">
                {format(selectedItem.timestamp, 'dd.MM.yyyy HH:mm', { locale: ru })}
              </span>
            </div>
            <div className="bg-editor-bg border border-editor-border rounded p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-auto">
              {selectedItem.text}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => loadText(selectedItem)}>
                Загрузить в редактор
              </Button>
              <Button
                variant="secondary"
                onClick={() => copyText(selectedItem.text)}
              >
                Копировать
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};