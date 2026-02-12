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
  onAdd: (exam: { subject: string; date: string; notes?: string }) => void;
}

export function AddExamDialog({ onAdd }: AddExamDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
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
    onAdd({ subject, date, notes });
    setSubject("");
    setDate("");
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
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              placeholder="e.g. Advanced Mathematics" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
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
            <Label htmlFor="notes">Optional Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Chapters 1-5, focus on calculus..." 
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