import Calculator from "@/components/Calculator";
import { NotesSection } from "@/components/notes/NotesSection";

const Index = () => {
  return (
    <div className="flex flex-col gap-4 items-start justify-center w-full">
      <Calculator />
      <NotesSection />
    </div>
  );
};

export default Index;