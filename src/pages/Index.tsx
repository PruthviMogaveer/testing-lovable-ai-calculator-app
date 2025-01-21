import Calculator from "@/components/Calculator";
import { NotesSection } from "@/components/notes/NotesSection";

const Index = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start justify-center">
      <Calculator />
      <NotesSection />
    </div>
  );
};

export default Index;