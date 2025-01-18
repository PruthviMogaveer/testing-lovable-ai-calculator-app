import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "./ui/button";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorHistory, type HistoryItem } from "./CalculatorHistory";
import { calculateResult, handleScientificCalculation } from "../utils/calculatorOperations";

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number>(0);
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [clearNext, setClearNext] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

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
      setOperation(op);
      setClearNext(true);
    } else if (operation) {
      const result = calculateResult(lastNumber, current, operation);
      if (result !== "Error") {
        setDisplay(result);
        setLastNumber(parseFloat(result));
        setOperation(op);
        setClearNext(true);
      } else {
        clear();
      }
    }
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
    const calculation = `${lastNumber} ${operation} ${current}`;
    const result = calculateResult(lastNumber, current, operation);
    
    if (result === "Error") {
      clear();
      return;
    }
    
    setDisplay(result);
    addToHistory(calculation, result);
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
    const current = parseFloat(display);
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
        setMemory(memory + current);
        toast.success("Added to memory");
        break;
      case 'M-':
        setMemory(memory - current);
        toast.success("Subtracted from memory");
        break;
    }
  };

  const handleScientific = (operation: string) => {
    const current = parseFloat(display);
    const result = handleScientificCalculation(operation, current);
    
    if (result !== "Error") {
      setDisplay(result);
      setClearNext(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-4 items-start justify-center p-4">
      <div className="bg-card p-6 rounded-3xl shadow-xl w-full max-w-md">
        <CalculatorDisplay display={display} />
        
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

      <CalculatorHistory history={history} setHistory={setHistory} />
    </div>
  );
};

export default Calculator;
