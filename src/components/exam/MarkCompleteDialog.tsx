"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MarkCompleteDialogProps {
  examSubject: string;
  onComplete: (score: number) => void;
}

export function MarkCompleteDialog({ examSubject, onComplete }: MarkCompleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum)) {
      toast({
        title: "Invalid score",
        description: "Please enter a valid numerical score.",
        variant: "destructive"
      });
      return;
    }
    onComplete(scoreNum);
    setOpen(false);
    toast({
      title: "Exam completed!",
      description: `Great job on your ${examSubject} exam.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/5">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Complete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Mark {examSubject} as Completed</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="score">Exam Score (out of 100)</Label>
            <Input 
              id="score" 
              type="number" 
              placeholder="e.g. 85" 
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-accent text-white hover:bg-accent/90">Submit Score</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}