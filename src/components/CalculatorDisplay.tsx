interface CalculatorDisplayProps {
  display: string;
}

export const CalculatorDisplay = ({ display }: CalculatorDisplayProps) => {
  return (
    <div className="bg-secondary/30 backdrop-blur-sm p-4 rounded-2xl mb-4">
      <div className="text-right text-4xl font-light truncate">
        {display}
      </div>
    </div>
  );
};