import { toast } from "sonner";

export const calculateResult = (num1: number, num2: number, op: string): string => {
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

export const handleScientificCalculation = (operation: string, current: number): string => {
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
        return "Error";
      }
      result = Math.log10(current);
      break;
    case 'ln':
      if (current <= 0) {
        toast.error("Invalid input for natural logarithm");
        return "Error";
      }
      result = Math.log(current);
      break;
    case 'sqrt':
      if (current < 0) {
        toast.error("Cannot calculate square root of negative number");
        return "Error";
      }
      result = Math.sqrt(current);
      break;
    case 'square':
      result = current * current;
      break;
    default:
      return "Error";
  }

  return result.toString();
};