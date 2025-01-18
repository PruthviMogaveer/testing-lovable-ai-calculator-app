import React from 'react';
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  const deleteCalculation = (id: string) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this calculation?");
    if (!shouldDelete) return;

    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success("Calculation deleted successfully");
  };

  return (
    <div className="bg-card p-6 rounded-3xl shadow-xl w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Calculation History</h2>
      <ScrollArea className="h-[500px]">
        {history.map((item) => (
          <div key={item.id} className="mb-4 p-3 bg-secondary/20 rounded-lg">
            <div className="text-sm text-muted-foreground">
              {item.timestamp.toLocaleString()}
            </div>
            <div className="text-lg font-medium flex justify-between items-center">
              <span>{item.calculation} = {item.result}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCalculation(item.id)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};