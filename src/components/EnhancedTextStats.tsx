import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, Eye, Hash } from "lucide-react";

interface EnhancedTextStatsProps {
  text: string;
}

export const EnhancedTextStats = ({ text }: EnhancedTextStatsProps) => {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
  const lines = text.split('\n').length;

  // Unique words calculation
  const uniqueWords = text.trim() 
    ? new Set(text.toLowerCase().match(/\b\w+\b/g) || []).size 
    : 0;

  // Reading time (200 words per minute)
  const readingTimeMinutes = Math.ceil(words / 200);

  const stats = [
    { label: 'Символы', value: characters, icon: Hash, color: 'text-blue-400' },
    { label: 'Без пробелов', value: charactersNoSpaces, icon: Hash, color: 'text-blue-300' },
    { label: 'Слова', value: words, icon: BarChart3, color: 'text-green-400' },
    { label: 'Предложения', value: sentences, icon: Eye, color: 'text-yellow-400' },
    { label: 'Абзацы', value: paragraphs, icon: BarChart3, color: 'text-purple-400' },
    { label: 'Строки', value: lines, icon: BarChart3, color: 'text-cyan-400' },
    { label: 'Уникальные слова', value: uniqueWords, icon: Hash, color: 'text-orange-400' },
    { label: 'Время чтения', value: `${readingTimeMinutes} мин`, icon: Clock, color: 'text-pink-400' },
  ];

  return (
    <Card className="bg-stats-bg border-editor-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Статистика текста</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center p-2 bg-editor-bg rounded border border-editor-border">
              <stat.icon className={`h-4 w-4 mb-1 ${stat.color}`} />
              <span className="text-xs text-muted-foreground text-center">{stat.label}</span>
              <span className="text-sm font-mono font-medium text-foreground">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};