import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface HistoryItem {
  calculation: string;
  result: string;
  timestamp: Date;
  note?: string;
}

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number>(0);
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [clearNext, setClearNext] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentNote, setCurrentNote] = useState<string>('');

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
      calculation,
      result,
      timestamp: new Date(),
      note: currentNote
    };
    setHistory(prev => [historyItem, ...prev]);
    setCurrentNote('');
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

  const handleScientific = (func: string) => {
    const current = parseFloat(display);
    let result = 0;
    
    switch (func) {
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
        result = Math.log10(current);
        break;
      case 'ln':
        result = Math.log(current);
        break;
      case 'sqrt':
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

  const clear = () => {
    setDisplay('0');
    setLastNumber(null);
    setOperation(null);
    setClearNext(false);
  };

  const handleMemory = (action: string) => {
    const current = parseFloat(display);
    
    switch (action) {
      case 'MC':
        setMemory(0);
        toast.success("Memory cleared");
        break;
      case 'MR':
        setDisplay(memory.toString());
        break;
      case 'M+':
        setMemory(memory + current);
        toast.success("Added to memory");
        break;
      case 'M-':
        setMemory(memory - current);
        toast.success("Subtracted from memory");
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-4 items-start justify-center p-4">
      <div className="bg-card p-6 rounded-3xl shadow-xl w-full max-w-md">
        <div className="bg-secondary/30 backdrop-blur-sm p-4 rounded-2xl mb-4">
          <div className="text-right text-4xl font-light truncate">
            {display}
          </div>
          <input
            type="text"
            placeholder="Add a note for this calculation..."
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            className="w-full mt-2 px-2 py-1 bg-secondary/20 rounded border border-secondary/30 text-sm"
          />
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {/* Memory Row */}
          <button onClick={() => handleMemory('MC')} className="function-btn">MC</button>
          <button onClick={() => handleMemory('MR')} className="function-btn">MR</button>
          <button onClick={() => handleMemory('M+')} className="function-btn">M+</button>
          <button onClick={() => handleMemory('M-')} className="function-btn">M-</button>
          
          {/* Scientific Functions */}
          <button onClick={() => handleScientific('sin')} className="function-btn">sin</button>
          <button onClick={() => handleScientific('cos')} className="function-btn">cos</button>
          <button onClick={() => handleScientific('tan')} className="function-btn">tan</button>
          <button onClick={() => handleScientific('log')} className="function-btn">log</button>
          
          <button onClick={() => handleScientific('ln')} className="function-btn">ln</button>
          <button onClick={() => handleScientific('sqrt')} className="function-btn">√</button>
          <button onClick={() => handleScientific('square')} className="function-btn">x²</button>
          <button onClick={clear} className="operation-btn">C</button>
          
          {/* Numbers and Basic Operations */}
          <button onClick={() => handleNumber('7')} className="number-btn">7</button>
          <button onClick={() => handleNumber('8')} className="number-btn">8</button>
          <button onClick={() => handleNumber('9')} className="number-btn">9</button>
          <button onClick={() => handleOperation('÷')} className="operation-btn">÷</button>
          
          <button onClick={() => handleNumber('4')} className="number-btn">4</button>
          <button onClick={() => handleNumber('5')} className="number-btn">5</button>
          <button onClick={() => handleNumber('6')} className="number-btn">6</button>
          <button onClick={() => handleOperation('×')} className="operation-btn">×</button>
          
          <button onClick={() => handleNumber('1')} className="number-btn">1</button>
          <button onClick={() => handleNumber('2')} className="number-btn">2</button>
          <button onClick={() => handleNumber('3')} className="number-btn">3</button>
          <button onClick={() => handleOperation('-')} className="operation-btn">-</button>
          
          <button onClick={() => handleNumber('0')} className="number-btn">0</button>
          <button onClick={() => handleNumber('.')} className="number-btn">.</button>
          <button onClick={handleBackspace} className="operation-btn">⌫</button>
          <button onClick={() => handleOperation('+')} className="operation-btn">+</button>
        </div>
      </div>

      <div className="bg-card p-6 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Calculation History</h2>
        <ScrollArea className="h-[500px]">
          {history.map((item, index) => (
            <div key={index} className="mb-4 p-3 bg-secondary/20 rounded-lg">
              <div className="text-sm text-muted-foreground">
                {item.timestamp.toLocaleString()}
              </div>
              <div className="text-lg font-medium">
                {item.calculation} = {item.result}
              </div>
              {item.note && (
                <div className="mt-1 text-sm text-primary/80 italic">
                  Note: {item.note}
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
