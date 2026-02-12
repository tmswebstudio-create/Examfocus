"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Exam } from "@/hooks/use-exams";

interface EditExamDialogProps {
  exam: Exam;
  onUpdate: (id: string, exam: Partial<Omit<Exam, 'id'>>) => void;
  triggerVariant?: "icon" | "outline";
}

export function EditExamDialog({ exam, onUpdate, triggerVariant = "icon" }: EditExamDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(exam.subject);
  const [syllabus, setSyllabus] = useState(exam.syllabus || "");
  const [date, setDate] = useState(exam.date);
  const [notes, setNotes] = useState(exam.notes || "");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !date) {
      toast({
        title: "Incomplete details",
        description: "Please provide both subject and date.",
        variant: "destructive"
      });
      return;
    }
    onUpdate(exam.id, { subject, syllabus, date, notes });
    setOpen(false);
    toast({
      title: "Exam updated",
      description: `${subject} has been updated.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerVariant === "icon" ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Exam Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Exam Title</Label>
            <Input 
              id="subject" 
              placeholder="e.g. Advanced Mathematics" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="syllabus">Syllabus</Label>
            <Textarea 
              id="syllabus" 
              placeholder="e.g. Chapters 1-5, focus on calculus..." 
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Exam Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Extra Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="e.g. Bring a specific calculator model." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-primary text-white">Update Exam</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
