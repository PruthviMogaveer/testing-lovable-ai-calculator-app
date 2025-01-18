import React, { useState } from 'react';
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Pencil, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { calculateResult } from "../utils/calculatorOperations";

export interface HistoryItem {
  id: string;
  calculation: string;
  result: string;
  timestamp: Date;
  note?: string;
  isEditing?: boolean;
}

interface CalculatorHistoryProps {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}

export const CalculatorHistory = ({ history, setHistory }: CalculatorHistoryProps) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');

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

  const handleAddNote = (id: string) => {
    const shouldAdd = window.confirm("Would you like to add a note to this calculation?");
    if (!shouldAdd) return;

    const noteName = window.prompt("Enter a name for this note:");
    if (!noteName) {
      toast.error("Note name is required");
      return;
    }

    setEditingNoteId(id);
    setTempNote(noteName);
  };

  const handleEditNote = (id: string, currentNote: string) => {
    setEditingNoteId(id);
    setTempNote(currentNote);
  };

  const handleNoteChange = (value: string) => {
    setTempNote(value);
  };

  const saveEditedNote = (id: string) => {
    if (!tempNote.trim()) {
      toast.error("Note cannot be empty");
      return;
    }
    setHistory(prev => prev.map(item => 
      item.id === id 
        ? { ...item, note: tempNote }
        : item
    ));
    setEditingNoteId(null);
    setTempNote('');
    toast.success("Note updated successfully");
  };

  const deleteCalculation = (id: string) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this calculation and its note?");
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
            {editingNoteId === item.id ? (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={tempNote}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm bg-secondary/30 rounded border border-secondary/40"
                  placeholder="Add a note..."
                />
                <Button
                  size="sm"
                  onClick={() => saveEditedNote(item.id)}
                  className="px-2"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-2">
                {item.note ? (
                  <div className="text-sm text-primary/80 italic">{item.note}</div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddNote(item.id)}
                    className="flex gap-1 items-center text-xs text-primary hover:text-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                    Add Note
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};