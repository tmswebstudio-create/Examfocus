"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, BookOpen } from "lucide-react";
import { generatePersonalizedStudyPlan } from "@/ai/flows/generate-personalized-study-plan";
import { type Exam } from "@/app/lib/exam-store";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StudyPlanToolProps {
  exam: Exam;
  history: Exam[];
}

export function StudyPlanTool({ exam, history }: StudyPlanToolProps) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const historicalPerformance = history
        .filter(h => h.completed && h.score !== undefined)
        .map(h => ({
          subject: h.subject,
          score: h.score!,
          date: h.date,
        }));

      const result = await generatePersonalizedStudyPlan({
        examSubject: exam.subject,
        examDate: exam.date,
        examNotes: exam.notes,
        historicalPerformance,
      });

      setPlan(result.studyPlan);
      toast({
        title: "Study plan generated!",
        description: `Your custom plan for ${exam.subject} is ready.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Generation failed",
        description: "Could not connect to AI service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5 text-accent" />
          AI Study Assistant
        </CardTitle>
        <CardDescription>
          Generate a personalized study roadmap for your upcoming {exam.subject} exam based on your history and goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!plan ? (
          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="w-full bg-accent text-white hover:bg-accent/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Performance...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate My Plan
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-accent/20 shadow-sm max-h-[400px] overflow-hidden">
               <ScrollArea className="h-[350px] pr-4">
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
                    {plan}
                  </div>
               </ScrollArea>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setPlan(null)} 
              className="w-full border-primary/20 hover:bg-primary/5"
            >
              Reset Assistant
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}