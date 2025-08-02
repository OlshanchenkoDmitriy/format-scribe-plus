import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Play, Square, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SunoEditorProps {
  text: string;
  onTextChange: (text: string) => void;
}

export const SunoEditor = ({ text, onTextChange }: SunoEditorProps) => {
  const { toast } = useToast();
  
  const sunoTags = [
    '[Intro]', '[Verse]', '[Chorus]', '[Bridge]', '[Outro]',
    '[Pre-Chorus]', '[Refrain]', '[Solo]', '[Break]', '[Fade Out]'
  ];

  const insertTag = (tag: string) => {
    const newText = text + (text.endsWith('\n') || text === '' ? '' : '\n\n') + tag + '\n';
    onTextChange(newText);
    toast({
      description: `Добавлен тег ${tag}`,
    });
  };

  const analyzeSong = () => {
    const lines = text.split('\n');
    const structure: string[] = [];
    let currentSection = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        currentSection = trimmed;
        if (!structure.includes(currentSection)) {
          structure.push(currentSection);
        }
      }
    });

    return structure;
  };

  const structure = analyzeSong();

  const exportSong = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suno-song.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      description: "Песня экспортирована",
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-suno/10 border-[hsl(340_75%_55%_/_0.3)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Music className="h-5 w-5 text-[hsl(340_75%_55%)]" />
            Suno Редактор
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Structure tags */}
          <div>
            <h3 className="text-sm font-medium mb-2">Структурные теги:</h3>
            <div className="flex flex-wrap gap-2">
              {sunoTags.map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  onClick={() => insertTag(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Song structure analysis */}
          {structure.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Структура песни:</h3>
              <div className="flex flex-wrap gap-1">
                {structure.map((section, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {section}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={exportSong}
              disabled={!text}
            >
              <Download className="h-4 w-4 mr-1" />
              Экспорт
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Text Editor */}
      <Textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Начните писать свою песню... Используйте теги [Verse], [Chorus] и другие для структуры."
        className="min-h-[400px] bg-editor-bg border-editor-border text-foreground resize-none text-sm leading-relaxed shadow-card font-mono"
      />
    </div>
  );
};