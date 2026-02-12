"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddResourceDialogProps {
  onAdd: (title: string, imageUrl: string) => void;
}

export function AddResourceDialog({ onAdd }: AddResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast({
        title: "Missing title",
        description: "Please provide a title for the resource.",
        variant: "destructive"
      });
      return;
    }
    onAdd(title, imageUrl);
    setTitle("");
    setImageUrl("");
    setOpen(false);
    toast({
      title: "Resource added",
      description: `${title} has been added to your collection.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Study Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Resource Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Chemistry Formulas" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Image Link (Optional)
            </Label>
            <Input 
              id="imageUrl" 
              placeholder="https://images.unsplash.com/..." 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground">If left blank, a random academic image will be used.</p>
          </div>
          <Button type="submit" className="w-full bg-primary text-white">Create Resource Card</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
