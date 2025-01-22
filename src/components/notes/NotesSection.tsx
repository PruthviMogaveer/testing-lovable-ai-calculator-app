import { useState } from "react";
import { Note } from "@/types/Note";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export const NotesSection = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [calculation, setCalculation] = useState("");
  const [result, setResult] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title for the note");
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      description,
      calculations: calculation && result ? [{
        id: crypto.randomUUID(),
        expression: calculation,
        result: result,
        timestamp: new Date()
      }] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes((prev) => [...prev, newNote]);
    setTitle("");
    setDescription("");
    setCalculation("");
    setResult("");
    setIsOpen(false);
    toast.success("Note added successfully");
  };

  const handleCalculate = () => {
    try {
      const calculatedResult = eval(calculation);
      setResult(calculatedResult.toString());
    } catch (error) {
      toast.error("Invalid calculation");
    }
  };

  return (
    <div className="bg-card p-6 rounded-3xl shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notes</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Note</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
              <DialogDescription>
                Add a new note with an optional calculation.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <Input
                  placeholder="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Note Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Enter calculation (e.g., 2 + 2)"
                  value={calculation}
                  onChange={(e) => setCalculation(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={handleCalculate}>
                    Calculate
                  </Button>
                  {result && (
                    <div className="flex items-center">
                      <span className="text-sm">Result: {result}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button type="submit">Save Note</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <ScrollArea className="h-[300px]">
        {notes.map((note) => (
          <div
            key={note.id}
            className="mb-4 p-4 bg-secondary/20 rounded-lg space-y-2"
          >
            <h3 className="font-medium">{note.title}</h3>
            <p className="text-sm text-muted-foreground">{note.description}</p>
            {note.calculations.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Calculations:</h4>
                {note.calculations.map((calc) => (
                  <div key={calc.id} className="text-sm">
                    {calc.expression} = {calc.result}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};