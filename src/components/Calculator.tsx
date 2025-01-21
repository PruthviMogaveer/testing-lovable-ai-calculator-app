import { useState } from "react";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorHistory } from "./CalculatorHistory";
import { toast } from "sonner";
import { HistoryItem } from "./CalculatorHistory";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [currentCalculation, setCurrentCalculation] = useState("");
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleNumber = (num: string) => {
    if (display === "0") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
    setCurrentCalculation(currentCalculation + num);
  };

  const handleOperator = (operator: string) => {
    setDisplay("0");
    setCurrentCalculation(currentCalculation + " " + operator + " ");
  };

  const handleEquals = () => {
    try {
      const result = eval(currentCalculation);
      setDisplay(result.toString());
      setHistory([
        {
          id: crypto.randomUUID(),
          calculation: currentCalculation,
          result: result.toString(),
          timestamp: new Date()
        },
        ...history,
      ]);
      setCurrentCalculation(result.toString());
    } catch (error) {
      toast.error("Invalid calculation");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setCurrentCalculation("");
  };

  const handleBackspace = () => {
    if (display.length === 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
    setCurrentCalculation(currentCalculation.slice(0, -1));
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setCurrentCalculation(currentCalculation + ".");
    }
  };

  const handlePlusMinus = () => {
    setDisplay((parseFloat(display) * -1).toString());
    setCurrentCalculation((parseFloat(currentCalculation) * -1).toString());
  };

  const handlePercentage = () => {
    const result = parseFloat(display) / 100;
    setDisplay(result.toString());
    setCurrentCalculation(result.toString());
  };

  const handleMemoryClear = () => {
    setMemory(0);
    toast.success("Memory cleared");
  };

  const handleMemoryRecall = () => {
    setDisplay(memory.toString());
    setCurrentCalculation(memory.toString());
  };

  const handleMemoryAdd = () => {
    setMemory(memory + parseFloat(display));
    toast.success("Added to memory");
  };

  const handleMemorySubtract = () => {
    setMemory(memory - parseFloat(display));
    toast.success("Subtracted from memory");
  };

  const handleScientificFunction = (func: string) => {
    const num = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(num);
        break;
      case 'cos':
        result = Math.cos(num);
        break;
      case 'tan':
        result = Math.tan(num);
        break;
      case 'log':
        result = Math.log10(num);
        break;
      case 'ln':
        result = Math.log(num);
        break;
      default:
        return;
    }

    setDisplay(result.toString());
    setCurrentCalculation(`${func}(${num}) = ${result}`);
  };

  const handleSquare = () => {
    const num = parseFloat(display);
    const result = num * num;
    setDisplay(result.toString());
    setCurrentCalculation(`${num}² = ${result}`);
  };

  const handleSquareRoot = () => {
    const num = parseFloat(display);
    const result = Math.sqrt(num);
    setDisplay(result.toString());
    setCurrentCalculation(`√${num} = ${result}`);
  };

  const handlePower = () => {
    setCurrentCalculation(currentCalculation + "**");
    setDisplay("0");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card p-6 rounded-3xl shadow-xl space-y-4">
        <CalculatorDisplay display={display} />
        <div className="grid grid-cols-4 gap-2">
          {/* Memory Functions */}
          <button className="function-btn" onClick={() => handleMemoryClear()}>MC</button>
          <button className="function-btn" onClick={() => handleMemoryRecall()}>MR</button>
          <button className="function-btn" onClick={() => handleMemoryAdd()}>M+</button>
          <button className="function-btn" onClick={() => handleMemorySubtract()}>M-</button>

          {/* Scientific Functions */}
          <button className="function-btn" onClick={() => handleScientificFunction('sin')}>sin</button>
          <button className="function-btn" onClick={() => handleScientificFunction('cos')}>cos</button>
          <button className="function-btn" onClick={() => handleScientificFunction('tan')}>tan</button>
          <button className="function-btn" onClick={() => handleScientificFunction('log')}>log</button>

          {/* Additional Operations */}
          <button className="function-btn" onClick={() => handleSquare()}>x²</button>
          <button className="function-btn" onClick={() => handleSquareRoot()}>√</button>
          <button className="function-btn" onClick={() => handlePower()}>^</button>
          <button className="function-btn" onClick={() => handleScientificFunction('ln')}>ln</button>

          {/* Clear and Basic Operations */}
          <button className="function-btn" onClick={() => handleClear()}>C</button>
          <button className="function-btn" onClick={() => handleBackspace()}>⌫</button>
          <button className="function-btn" onClick={() => handlePercentage()}>%</button>
          <button className="operation-btn" onClick={() => handleOperator('/')}>/</button>

          {/* Numbers and Operations */}
          <button className="number-btn" onClick={() => handleNumber('7')}>7</button>
          <button className="number-btn" onClick={() => handleNumber('8')}>8</button>
          <button className="number-btn" onClick={() => handleNumber('9')}>9</button>
          <button className="operation-btn" onClick={() => handleOperator('*')}>×</button>

          <button className="number-btn" onClick={() => handleNumber('4')}>4</button>
          <button className="number-btn" onClick={() => handleNumber('5')}>5</button>
          <button className="number-btn" onClick={() => handleNumber('6')}>6</button>
          <button className="operation-btn" onClick={() => handleOperator('-')}>-</button>

          <button className="number-btn" onClick={() => handleNumber('1')}>1</button>
          <button className="number-btn" onClick={() => handleNumber('2')}>2</button>
          <button className="number-btn" onClick={() => handleNumber('3')}>3</button>
          <button className="operation-btn" onClick={() => handleOperator('+')}>+</button>

          <button className="number-btn" onClick={() => handleNumber('0')}>0</button>
          <button className="number-btn" onClick={() => handleDecimal()}>.</button>
          <button className="number-btn" onClick={() => handlePlusMinus()}>±</button>
          <button className="operation-btn" onClick={() => handleEquals()}>=</button>
        </div>
      </div>
      <CalculatorHistory history={history} setHistory={setHistory} />
    </div>
  );
};

export default Calculator;
