import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export interface HistoryItem {
  id: string;
  calculation: string;
  result: string;
  timestamp: Date;
}

interface CalculatorHistoryProps {
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  onHistoryItemClick?: (item: HistoryItem) => void;
}

export const CalculatorHistory = ({ 
  history, 
  setHistory,
  onHistoryItemClick 
}: CalculatorHistoryProps) => {
  return (
    <div className="mt-4 p-4 bg-card rounded-3xl">
      <h2 className="text-lg font-semibold mb-2">History</h2>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => onHistoryItemClick?.(item)}
            >
              <div className="text-sm">{item.calculation} = {item.result}</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {history.length > 0 && (
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => setHistory([])}
        >
          Clear History
        </Button>
      )}
    </div>
  );
};