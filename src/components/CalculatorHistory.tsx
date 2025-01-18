import React from 'react';
import { ScrollArea } from "./ui/scroll-area";

export interface HistoryItem {
  id: string;
  calculation: string;
  result: string;
  timestamp: Date;
}

interface CalculatorHistoryProps {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}

export const CalculatorHistory = ({ history, setHistory }: CalculatorHistoryProps) => {
  return (
    <div className="bg-card p-6 rounded-3xl shadow-xl w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Calculation History</h2>
      <ScrollArea className="h-[500px]">
        {history.map((item) => (
          <div key={item.id} className="mb-4 p-3 bg-secondary/20 rounded-lg">
            <div className="text-sm text-muted-foreground">
              {item.timestamp.toLocaleString()}
            </div>
            <div className="text-lg font-medium">
              <span>{item.calculation} = {item.result}</span>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};