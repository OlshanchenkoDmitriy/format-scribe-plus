interface TextStatsProps {
  text: string;
}

export const TextStats = ({ text }: TextStatsProps) => {
  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;

  return (
    <div className="flex gap-4 p-3 bg-stats-bg rounded-lg border border-editor-border">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">S</span>
        <span className="text-sm font-mono text-foreground">{characters}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">W</span>
        <span className="text-sm font-mono text-foreground">{words}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">L</span>
        <span className="text-sm font-mono text-foreground">{lines}</span>
      </div>
    </div>
  );
};