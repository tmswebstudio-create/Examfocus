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
  onComplete: (gained: number, total: number) => void;
}

export function MarkCompleteDialog({ examSubject, onComplete }: MarkCompleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [gained, setGained] = useState("");
  const [total, setTotal] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gainedNum = parseFloat(gained);
    const totalNum = parseFloat(total);

    if (isNaN(gainedNum) || isNaN(totalNum)) {
      toast({
        title: "Invalid input",
        description: "Please enter valid numerical marks.",
        variant: "destructive"
      });
      return;
    }

    if (totalNum <= 0) {
      toast({
        title: "Invalid total marks",
        description: "Total marks must be greater than zero.",
        variant: "destructive"
      });
      return;
    }

    if (gainedNum > totalNum) {
      toast({
        title: "Wait a second",
        description: "Gained marks cannot exceed total marks.",
        variant: "destructive"
      });
      return;
    }

    onComplete(gainedNum, totalNum);
    setOpen(false);
    setGained("");
    setTotal("");
    toast({
      title: "Exam completed!",
      description: `Results for ${examSubject} have been recorded.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white transition-colors">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Complete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Complete {examSubject}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gained">Marks Gained</Label>
              <Input 
                id="gained" 
                type="number" 
                placeholder="e.g. 85" 
                value={gained}
                onChange={(e) => setGained(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Total Marks</Label>
              <Input 
                id="total" 
                type="number" 
                placeholder="e.g. 100" 
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Estimated Grade</p>
            <p className="text-2xl font-black text-primary">
              {gained && total && parseFloat(total) > 0 ? Math.round((parseFloat(gained) / parseFloat(total)) * 100) : 0}%
            </p>
          </div>
          <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90">Submit Results</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
