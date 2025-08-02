import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Replace, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchReplaceProps {
  text: string;
  onTextChange: (text: string) => void;
}

export const SearchReplace = ({ text, onTextChange }: SearchReplaceProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [lastReplace, setLastReplace] = useState<{original: string, count: number} | null>(null);
  const { toast } = useToast();

  const countOccurrences = (str: string, term: string) => {
    if (!term) return 0;
    return (str.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
  };

  const handleReplace = () => {
    if (!searchTerm.trim()) {
      toast({
        description: "Введите текст для поиска",
        variant: "destructive",
      });
      return;
    }

    const count = countOccurrences(text, searchTerm);
    if (count === 0) {
      toast({
        description: "Текст для поиска не найден",
        variant: "destructive",
      });
      return;
    }

    const originalText = text;
    const newText = text.replace(
      new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
      replaceTerm
    );

    setLastReplace({ original: originalText, count });
    onTextChange(newText);
    
    toast({
      description: `Заменено ${count} вхождений`,
    });
  };

  const handleUndo = () => {
    if (lastReplace) {
      onTextChange(lastReplace.original);
      setLastReplace(null);
      toast({
        description: "Замена отменена",
      });
    }
  };

  const searchCount = countOccurrences(text, searchTerm);

  return (
    <Card className="bg-card/50 border-editor-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Search className="h-4 w-4" />
          Поиск и замена
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="relative">
            <Input
              placeholder="Найти..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-16"
            />
            {searchTerm && (
              <Badge 
                variant="secondary" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs"
              >
                {searchCount}
              </Badge>
            )}
          </div>
          
          <Input
            placeholder="Заменить на..."
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReplace}
            disabled={!searchTerm.trim() || searchCount === 0}
            className="flex-1"
          >
            <Replace className="h-4 w-4 mr-1" />
            Заменить все
          </Button>
          
          {lastReplace && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {lastReplace && (
          <div className="text-xs text-muted-foreground">
            Последняя замена: {lastReplace.count} вхождений
          </div>
        )}
      </CardContent>
    </Card>
  );
};