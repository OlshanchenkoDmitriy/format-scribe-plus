import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SymbolActionsProps {
  text: string;
  onTextChange: (text: string) => void;
}

const COMMON_SYMBOLS = [
  '#', '*', '_', '-', '~', '`', '>', '!', '[', ']', '(', ')', '{', '}', 
  '|', '\\', '+', '1', '.', '<', ':', '"', "'", '$', '^', '=', '/', '&'
];

const SYMBOL_REPLACEMENTS = [
  { from: '()', to: '[]' },
  { from: '[]', to: '()' },
  { from: '{}', to: '()' },
  { from: '""', to: "''" },
  { from: "''", to: '""' },
  { from: '--', to: '—' },
  { from: '...', to: '…' },
  { from: '+-', to: '±' },
];

export const SymbolActions = ({ text, onTextChange }: SymbolActionsProps) => {
  const [replaceFrom, setReplaceFrom] = useState('');
  const [replaceTo, setReplaceTo] = useState('');
  const { toast } = useToast();

  const removeSymbol = (symbol: string) => {
    const newText = text.split(symbol).join('');
    onTextChange(newText);
    toast({
      description: `Символ "${symbol}" удален из текста`,
    });
  };

  const replaceSymbols = () => {
    if (!replaceFrom) return;
    
    const newText = text.split(replaceFrom).join(replaceTo);
    onTextChange(newText);
    toast({
      description: `"${replaceFrom}" заменено на "${replaceTo}"`,
    });
  };

  const applyReplacement = (from: string, to: string) => {
    const newText = text.split(from).join(to);
    onTextChange(newText);
    toast({
      description: `"${from}" заменено на "${to}"`,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-card border border-editor-border rounded-lg">
      <div>
        <h3 className="text-sm font-medium mb-3 text-foreground">Удалить символы</h3>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
          {COMMON_SYMBOLS.map((symbol) => (
            <Button
              key={symbol}
              variant="secondary"
              size="sm"
              onClick={() => removeSymbol(symbol)}
              className="bg-symbol-button hover:bg-symbol-button-hover text-xs font-mono h-8 w-8 p-0"
            >
              {symbol}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 text-foreground">Замена символов</h3>
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <Label htmlFor="replace-from" className="text-xs">Заменить</Label>
            <Input
              id="replace-from"
              value={replaceFrom}
              onChange={(e) => setReplaceFrom(e.target.value)}
              placeholder="Что заменить"
              className="bg-editor-bg border-editor-border"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="replace-to" className="text-xs">На</Label>
            <Input
              id="replace-to"
              value={replaceTo}
              onChange={(e) => setReplaceTo(e.target.value)}
              placeholder="На что заменить"
              className="bg-editor-bg border-editor-border"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={replaceSymbols}
              disabled={!replaceFrom}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              Заменить
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SYMBOL_REPLACEMENTS.map((replacement, index) => (
            <Button
              key={index}
              variant="secondary"
              size="sm"
              onClick={() => applyReplacement(replacement.from, replacement.to)}
              className="bg-action-button hover:bg-action-button-hover text-xs font-mono"
            >
              {replacement.from} → {replacement.to}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};