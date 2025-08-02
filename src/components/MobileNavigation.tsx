import { Button } from "@/components/ui/button";
import { FileText, Mic, Music, History, Settings } from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const tabs = [
    { id: 'editor', icon: FileText, label: 'Редактор' },
    { id: 'voice', icon: Mic, label: 'Голос' },
    { id: 'suno', icon: Music, label: 'Suno' },
    { id: 'history', icon: History, label: 'История' },
    { id: 'settings', icon: Settings, label: 'Настройки' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-editor-border z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col gap-1 h-auto py-2 px-3 ${
              activeTab === tab.id 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="text-xs">{tab.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};