import React from 'react';
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Pencil, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { calculateResult } from "../utils/calculatorOperations";

export interface HistoryItem {
  id: string;
  calculation: string;
  result: string;
  timestamp: Date;
  isEditing?: boolean;
}

interface CalculatorHistoryProps {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}

export const CalculatorHistory = ({ history, setHistory }: CalculatorHistoryProps) => {
  const handleEditCalculation = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isEditing: true }
        : item
    ));
  };

  const saveEditedCalculation = (id: string, newCalculation: string) => {
    try {
      const parts = newCalculation.trim().split(' ');
      if (parts.length !== 3) {
        toast.error("Invalid calculation format. Use: number operator number");
        return;
      }

      const [num1Str, op, num2Str] = parts;
      const num1 = parseFloat(num1Str);
      const num2 = parseFloat(num2Str);

      if (isNaN(num1) || isNaN(num2) || !op.match(/[+\-×÷]/)) {
        toast.error("Invalid calculation format. Use: number operator number");
        return;
      }

      const newResult = calculateResult(num1, num2, op);
      
      if (newResult === "Error") {
        toast.error("Invalid calculation");
        return;
      }

      setHistory(prev => prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              calculation: newCalculation,
              result: newResult,
              isEditing: false
            }
          : item
      ));
      toast.success("Calculation updated successfully");
    } catch (error) {
      toast.error("Invalid calculation format. Use: number operator number");
    }
  };

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
            {item.isEditing ? (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  defaultValue={item.calculation}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveEditedCalculation(item.id, e.currentTarget.value);
                    }
                  }}
                  className="flex-1 px-2 py-1 text-sm bg-secondary/30 rounded border border-secondary/40"
                  placeholder="Format: number operator number"
                />
                <Button
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector('input');
                    if (input) {
                      saveEditedCalculation(item.id, input.value);
                    }
                  }}
                  className="px-2"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-lg font-medium flex justify-between items-center">
                <span>{item.calculation} = {item.result}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCalculation(item.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
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
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};