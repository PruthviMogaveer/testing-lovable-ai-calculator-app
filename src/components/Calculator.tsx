import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Pencil, Save, Plus } from "lucide-react";

interface HistoryItem {
  id: string;
  calculation: string;
  result: string;
  timestamp: Date;
  note?: string;
  isEditing?: boolean;
}

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number>(0);
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [clearNext, setClearNext] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState<string>('');

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setHistory(parsedHistory);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else {
        switch (e.key) {
          case '+':
            handleOperation('+');
            break;
          case '-':
            handleOperation('-');
            break;
          case '*':
            handleOperation('×');
            break;
          case '/':
            handleOperation('÷');
            break;
          case 'Enter':
            calculate();
            break;
          case 'Escape':
            clear();
            break;
          case '.':
            handleNumber('.');
            break;
          case 'Backspace':
            handleBackspace();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, lastNumber, operation]);

  const addToHistory = (calculation: string, result: string) => {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      calculation,
      result,
      timestamp: new Date(),
    };
    setHistory(prev => [historyItem, ...prev]);
  };

  const handleEditCalculation = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isEditing: true }
        : item
    ));
  };

  const saveEditedCalculation = (id: string, newCalculation: string, newResult: string) => {
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
  };

  const handleAddNote = (id: string) => {
    setEditingNoteId(id);
    setEditedNote('');
  };

  const handleNumber = (num: string) => {
    if (clearNext) {
      setDisplay(num);
      setClearNext(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    if (lastNumber === null) {
      setLastNumber(current);
    } else if (operation) {
      calculate();
    }
    setOperation(op);
    setClearNext(true);
  };

  const handleBackspace = () => {
    if (display === '0' || display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const calculate = () => {
    if (lastNumber === null || !operation) return;
    
    const current = parseFloat(display);
    let result = 0;
    const calculation = `${lastNumber} ${operation} ${current}`;
    
    switch (operation) {
      case '+':
        result = lastNumber + current;
        break;
      case '-':
        result = lastNumber - current;
        break;
      case '×':
        result = lastNumber * current;
        break;
      case '÷':
        if (current === 0) {
          toast.error("Cannot divide by zero!");
          clear();
          return;
        }
        result = lastNumber / current;
        break;
      default:
        return;
    }
    
    const resultString = result.toString();
    setDisplay(resultString);
    addToHistory(calculation, resultString);
    setLastNumber(null);
    setOperation(null);
  };

  const clear = () => {
    setDisplay('0');
    setLastNumber(null);
    setOperation(null);
    setClearNext(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-4 items-start justify-center p-4">
      <div className="bg-card p-6 rounded-3xl shadow-xl w-full max-w-md">
        <div className="bg-secondary/30 backdrop-blur-sm p-4 rounded-2xl mb-4">
          <div className="text-right text-4xl font-light truncate">
            {display}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <button onClick={clear} className="operation-btn col-span-2">C</button>
          <button onClick={handleBackspace} className="operation-btn col-span-2">⌫</button>
          
          <button onClick={() => handleMemory('MC')} className="function-btn">MC</button>
          <button onClick={() => handleMemory('MR')} className="function-btn">MR</button>
          <button onClick={() => handleMemory('M+')} className="function-btn">M+</button>
          <button onClick={() => handleMemory('M-')} className="function-btn">M-</button>
          
          <button onClick={() => handleScientific('sin')} className="function-btn">sin</button>
          <button onClick={() => handleScientific('cos')} className="function-btn">cos</button>
          <button onClick={() => handleScientific('tan')} className="function-btn">tan</button>
          <button onClick={() => handleScientific('log')} className="function-btn">log</button>
          
          <button onClick={() => handleScientific('ln')} className="function-btn">ln</button>
          <button onClick={() => handleScientific('sqrt')} className="function-btn">√</button>
          <button onClick={() => handleScientific('square')} className="function-btn">x²</button>
          <button onClick={() => handleOperation('÷')} className="operation-btn">÷</button>
          
          <button onClick={() => handleNumber('7')} className="number-btn">7</button>
          <button onClick={() => handleNumber('8')} className="number-btn">8</button>
          <button onClick={() => handleNumber('9')} className="number-btn">9</button>
          <button onClick={() => handleOperation('×')} className="operation-btn">×</button>
          
          <button onClick={() => handleNumber('4')} className="number-btn">4</button>
          <button onClick={() => handleNumber('5')} className="number-btn">5</button>
          <button onClick={() => handleNumber('6')} className="number-btn">6</button>
          <button onClick={() => handleOperation('-')} className="operation-btn">-</button>
          
          <button onClick={() => handleNumber('1')} className="number-btn">1</button>
          <button onClick={() => handleNumber('2')} className="number-btn">2</button>
          <button onClick={() => handleNumber('3')} className="number-btn">3</button>
          <button onClick={() => handleOperation('+')} className="operation-btn">+</button>
          
          <button onClick={() => handleNumber('0')} className="number-btn col-span-2">0</button>
          <button onClick={() => handleNumber('.')} className="number-btn">.</button>
          <button onClick={calculate} className="operation-btn">=</button>
        </div>
      </div>

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
                    value={item.calculation}
                    onChange={(e) => {
                      const [num1, op, num2] = e.target.value.split(' ');
                      const result = calculateResult(parseFloat(num1), parseFloat(num2), op);
                      saveEditedCalculation(item.id, e.target.value, result.toString());
                    }}
                    className="flex-1 px-2 py-1 text-sm bg-secondary/30 rounded border border-secondary/40"
                  />
                  <Button
                    size="sm"
                    onClick={() => saveEditedCalculation(item.id, item.calculation, item.result)}
                    className="px-2"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-lg font-medium flex justify-between items-center">
                  <span>{item.calculation} = {item.result}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCalculation(item.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {editingNoteId === item.id ? (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
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
                <div className="mt-1 text-sm text-primary/80 italic flex justify-between items-center">
                  {item.note ? (
                    <>
                      <span>{item.note}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(item.id, item.note || '')}
                        className="h-6 w-6 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddNote(item.id)}
                      className="flex gap-1 items-center text-xs"
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
    </div>
  );
};

export default Calculator;
