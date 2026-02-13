"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddExamDialogProps {
  onAdd: (exam: { subject: string; category?: string; syllabus?: string; date: string; time?: string; notes?: string }) => void;
}

export function AddExamDialog({ onAdd }: AddExamDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
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
    onAdd({ subject, category, syllabus, date, time, notes });
    setSubject("");
    setCategory("");
    setSyllabus("");
    setDate("");
    setTime("");
    setNotes("");
    setOpen(false);
    toast({
      title: "Exam scheduled",
      description: `${subject} has been added to your list.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Exam
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New Exam</DialogTitle>
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
            <Label htmlFor="category">Category (Optional)</Label>
            <Input 
              id="category" 
              placeholder="e.g. Mid-term, Final, Quiz" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="time">Exam Time (Optional)</Label>
              <Input 
                id="time" 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
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
          <Button type="submit" className="w-full bg-primary text-white">Save Exam</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
