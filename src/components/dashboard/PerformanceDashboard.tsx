"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Line, LineChart, CartesianGrid } from "recharts";
import { type Exam } from "@/app/lib/exam-store";
import { TrendingUp, GraduationCap, Award, Calculator } from "lucide-react";

interface PerformanceDashboardProps {
  exams: Exam[];
}

export function PerformanceDashboard({ exams }: PerformanceDashboardProps) {
  const completedExams = exams
    .filter(e => e.completed && e.score !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const averageScore = completedExams.length > 0
    ? Math.round(completedExams.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedExams.length)
    : 0;

  const highestScore = completedExams.length > 0
    ? Math.max(...completedExams.map(e => e.score || 0))
    : 0;

  const chartData = completedExams.map(e => ({
    name: e.subject.length > 15 ? e.subject.substring(0, 12) + '...' : e.subject,
    score: e.score,
    fullSubject: e.subject
  }));

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-none shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Calculator className="h-16 w-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Based on {completedExams.length} exams</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Award className="h-16 w-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{highestScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Outstanding performance!</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <GraduationCap className="h-16 w-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Exams Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{completedExams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance Over Time
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          {completedExams.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    domain={[0, 100]}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="score" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Calculator className="h-12 w-12 mb-2 opacity-20" />
              <p>No completed exams yet to show performance insights.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}