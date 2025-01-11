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

  const saveEditedCalculation = (id: string, newCalculation: string) => {
    try {
      // Split the calculation string into components
      const [num1Str, op, num2Str] = newCalculation.trim().split(' ');
      const num1 = parseFloat(num1Str);
      const num2 = parseFloat(num2Str);

      // Validate the input
      if (isNaN(num1) || isNaN(num2) || !op.match(/[+\-×÷]/)) {
        toast.error("Invalid calculation format. Use: number operator number");
        return;
      }

      // Calculate the new result
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

  const handleMemory = (operation: string) => {
    switch (operation) {
      case 'MC':
        setMemory(0);
        toast.success("Memory cleared");
        break;
      case 'MR':
        setDisplay(memory.toString());
        toast.success("Memory recalled");
        break;
      case 'M+':
        setMemory(memory + parseFloat(display));
        toast.success("Added to memory");
        break;
      case 'M-':
        setMemory(memory - parseFloat(display));
        toast.success("Subtracted from memory");
        break;
    }
  };

  const handleScientific = (operation: string) => {
    const current = parseFloat(display);
    let result: number;

    switch (operation) {
      case 'sin':
        result = Math.sin(current);
        break;
      case 'cos':
        result = Math.cos(current);
        break;
      case 'tan':
        result = Math.tan(current);
        break;
      case 'log':
        if (current <= 0) {
          toast.error("Invalid input for logarithm");
          return;
        }
        result = Math.log10(current);
        break;
      case 'ln':
        if (current <= 0) {
          toast.error("Invalid input for natural logarithm");
          return;
        }
        result = Math.log(current);
        break;
      case 'sqrt':
        if (current < 0) {
          toast.error("Cannot calculate square root of negative number");
          return;
        }
        result = Math.sqrt(current);
        break;
      case 'square':
        result = current * current;
        break;
      default:
        return;
    }

    setDisplay(result.toString());
    setClearNext(true);
  };

  const calculateResult = (num1: number, num2: number, op: string): string => {
    let result: number;
    switch (op) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '×':
        result = num1 * num2;
        break;
      case '÷':
        if (num2 === 0) {
          toast.error("Cannot divide by zero");
          return "Error";
        }
        result = num1 / num2;
        break;
      default:
        return "Error";
    }
    return result.toString();
  };

  const handleEditNote = (id: string, currentNote: string) => {
    setEditingNoteId(id);
    setEditedNote(currentNote);
  };

  const saveEditedNote = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id 
        ? { ...item, note: editedNote }
        : item
    ));
    setEditingNoteId(null);
    toast.success("Note updated successfully");
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
