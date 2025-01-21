import Calculator from "@/components/Calculator";
import { NotesSection } from "@/components/notes/NotesSection";

const Index = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Calculator />
      <NotesSection />
    </div>
  );
};

export default Index;