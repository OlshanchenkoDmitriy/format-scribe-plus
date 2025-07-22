import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FrequentActionsProps {
  text: string;
  onTextChange: (text: string) => void;
}

export const FrequentActions = ({ text, onTextChange }: FrequentActionsProps) => {
  const { toast } = useToast();

  const actions = [
    {
      name: "Убрать пробелы",
      action: () => {
        const newText = text.replace(/\s+/g, ' ').trim();
        onTextChange(newText);
        toast({ description: "Лишние пробелы удалены" });
      }
    },
    {
      name: "В одну строку",
      action: () => {
        const lines = text.split('\n').filter(line => line.trim());
        const newText = lines.join(', ');
        onTextChange(newText);
        toast({ description: "Текст преобразован в одну строку" });
      }
    },
    {
      name: "Убрать хештеги",
      action: () => {
        const newText = text.replace(/#\w+/g, '').replace(/\s+/g, ' ').trim();
        onTextChange(newText);
        toast({ description: "Хештеги удалены" });
      }
    },
    {
      name: "Убрать Markdown",
      action: () => {
        let newText = text
          .replace(/\*\*(.*?)\*\*/g, '$1') // bold
          .replace(/\*(.*?)\*/g, '$1') // italic
          .replace(/__(.*?)__/g, '$1') // bold
          .replace(/_(.*?)_/g, '$1') // italic
          .replace(/`(.*?)`/g, '$1') // code
          .replace(/```[\s\S]*?```/g, '') // code blocks
          .replace(/^#+\s/gm, '') // headers
          .replace(/^\>\s/gm, '') // quotes
          .replace(/^\*\s/gm, '') // lists
          .replace(/^\-\s/gm, '') // lists
          .replace(/^\+\s/gm, '') // lists
          .replace(/^\d+\.\s/gm, '') // numbered lists
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
          .replace(/\s+/g, ' ')
          .trim();
        onTextChange(newText);
        toast({ description: "Markdown разметка удалена" });
      }
    },
    {
      name: "Убрать (...)",
      action: () => {
        const newText = text.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
        onTextChange(newText);
        toast({ description: "Содержимое в скобках () удалено" });
      }
    },
    {
      name: "Убрать [...]",
      action: () => {
        const newText = text.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
        onTextChange(newText);
        toast({ description: "Содержимое в скобках [] удалено" });
      }
    },
    {
      name: "Убрать разрывы",
      action: () => {
        const newText = text.replace(/\n\s*\n/g, '\n').trim();
        onTextChange(newText);
        toast({ description: "Лишние разрывы строк удалены" });
      }
    },
    {
      name: "Норм. пробелы",
      action: () => {
        let newText = text
          .replace(/([.!?])\s*([А-ЯЁA-Z])/g, '$1 $2') // пробел после точки перед заглавной
          .replace(/([,;:])\s*/g, '$1 ') // пробел после запятой, точки с запятой, двоеточия
          .replace(/\s+([.!?,:;])/g, '$1') // убираем пробелы перед знаками препинания
          .replace(/\s+/g, ' ') // множественные пробелы в один
          .trim();
        onTextChange(newText);
        toast({ description: "Пробелы нормализованы" });
      }
    },
    {
      name: "Убрать цифры",
      action: () => {
        const newText = text.replace(/\d+/g, '').replace(/\s+/g, ' ').trim();
        onTextChange(newText);
        toast({ description: "Цифры удалены" });
      }
    },
    {
      name: "ВЕРХНИЙ РЕГИСТР",
      action: () => {
        const newText = text.toUpperCase();
        onTextChange(newText);
        toast({ description: "Текст переведен в верхний регистр" });
      }
    },
    {
      name: "нижний регистр",
      action: () => {
        const newText = text.toLowerCase();
        onTextChange(newText);
        toast({ description: "Текст переведен в нижний регистр" });
      }
    },
    {
      name: "Заглавные Буквы",
      action: () => {
        const newText = text.replace(/\b\w/g, char => char.toUpperCase());
        onTextChange(newText);
        toast({ description: "Первые буквы слов сделаны заглавными" });
      }
    }
  ];

  return (
    <div className="space-y-4 p-4 bg-card border border-editor-border rounded-lg">
      <h3 className="text-sm font-medium text-foreground">Частые действия</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="secondary"
            size="sm"
            onClick={action.action}
            disabled={!text}
            className="bg-action-button hover:bg-action-button-hover text-xs h-9 whitespace-nowrap"
          >
            {action.name}
          </Button>
        ))}
      </div>
    </div>
  );
};