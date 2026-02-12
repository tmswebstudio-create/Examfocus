"use client";

import { useExams } from "@/app/lib/exam-store";
import { AddExamDialog } from "@/components/exam/AddExamDialog";
import { ExamCountdown } from "@/components/exam/Countdown";
import { MarkCompleteDialog } from "@/components/exam/MarkCompleteDialog";
import { PerformanceDashboard } from "@/components/dashboard/PerformanceDashboard";
import { StudyPlanTool } from "@/components/exam/StudyPlanTool";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, History, LayoutDashboard, BrainCircuit, Trash2, Clock, Sparkles } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { exams, isLoaded, addExam, markCompleted, deleteExam } = useExams();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
          <p className="text-primary font-medium">Focusing...</p>
        </div>
      </div>
    );
  }

  const upcomingExams = exams
    .filter(e => !e.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const pastExams = exams
    .filter(e => e.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const nextExam = upcomingExams[0];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-border p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary p-2 rounded-lg">
            <LayoutDashboard className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">ExamFocus</span>
        </div>

        <nav className="flex flex-col gap-1">
          <Button 
            variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} 
            className="justify-start px-3"
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
            Overview
          </Button>
          <Button 
            variant={activeTab === 'upcoming' ? 'secondary' : 'ghost'} 
            className="justify-start px-3"
            onClick={() => setActiveTab('upcoming')}
          >
            <Clock className="mr-3 h-4 w-4 text-primary" />
            Upcoming Exams
          </Button>
          <Button 
            variant={activeTab === 'history' ? 'secondary' : 'ghost'} 
            className="justify-start px-3"
            onClick={() => setActiveTab('history')}
          >
            <History className="mr-3 h-4 w-4 text-primary" />
            Exam History
          </Button>
          <Button 
            variant={activeTab === 'study' ? 'secondary' : 'ghost'} 
            className="justify-start px-3"
            onClick={() => setActiveTab('study')}
          >
            <BrainCircuit className="mr-3 h-4 w-4 text-primary" />
            Study Assistant
          </Button>
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="bg-blue-50/50 p-4 rounded-xl">
             <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">Productivity Tip</p>
             <p className="text-xs text-muted-foreground leading-relaxed">Taking short 5-minute breaks every hour improves focus significantly.</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, Student!</h1>
            <p className="text-muted-foreground mt-1">Stay focused and track your academic journey.</p>
          </div>
          <AddExamDialog onAdd={addExam} />
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Featured Next Exam */}
            {nextExam ? (
              <Card className="border-none bg-gradient-to-r from-primary to-accent text-white shadow-xl shadow-primary/20 overflow-hidden relative">
                <div className="absolute -right-10 -top-10 bg-white/10 rounded-full h-40 w-40 blur-3xl"></div>
                <CardHeader className="pb-2">
                   <Badge variant="outline" className="w-fit text-white border-white/40 bg-white/10 mb-2">Next Milestone</Badge>
                   <CardTitle className="text-4xl font-black tracking-tight">{nextExam.subject}</CardTitle>
                   <div className="flex items-center gap-2 opacity-80 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{format(parseISO(nextExam.date), 'MMMM d, yyyy')}</span>
                   </div>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8 py-8">
                   <div className="bg-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-xl border border-white/20 w-full md:w-auto shadow-2xl">
                      <ExamCountdown date={nextExam.date} variant="featured" />
                   </div>
                   <div className="flex gap-3">
                      <MarkCompleteDialog examSubject={nextExam.subject} onComplete={(s) => markCompleted(nextExam.id, s)} />
                   </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-2 bg-muted/30 p-10 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No Upcoming Exams</h2>
                <p className="text-muted-foreground mb-6">Your schedule is currently clear. Add a new exam to start tracking.</p>
                <AddExamDialog onAdd={addExam} />
              </Card>
            )}

            {/* Stats Section */}
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                Your Progress
              </h2>
              <PerformanceDashboard exams={exams} />
            </div>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Upcoming Exams</h2>
                <Badge variant="secondary">{upcomingExams.length} Scheduled</Badge>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingExams.map((exam) => (
                  <Card key={exam.id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden flex flex-col">
                    <div className="h-2 bg-primary"></div>
                    <CardHeader>
                      <CardTitle className="text-lg leading-tight">{exam.subject}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                        <Calendar className="h-3 w-3" />
                        {format(parseISO(exam.date), 'EEE, MMM d')}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      {exam.notes && (
                        <p className="text-xs text-muted-foreground italic line-clamp-2">"{exam.notes}"</p>
                      )}
                      <div className="py-4 border-y border-border/50 flex justify-center">
                        <ExamCountdown date={exam.date} />
                      </div>
                    </CardContent>
                    <div className="p-4 bg-muted/10 flex items-center justify-between">
                      <MarkCompleteDialog examSubject={exam.subject} onComplete={(s) => markCompleted(exam.id, s)} />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={() => deleteExam(exam.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                {upcomingExams.length === 0 && (
                  <div className="col-span-full py-20 text-center text-muted-foreground">
                    No upcoming exams found. Time to relax or schedule a new one!
                  </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Exam History</h2>
              <Badge className="bg-accent text-white">{pastExams.length} Completed</Badge>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Subject</th>
                      <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Date</th>
                      <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Result</th>
                      <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastExams.map((exam) => (
                      <tr key={exam.id} className="border-b border-border/50 last:border-none hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 font-medium">{exam.subject}</td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">{format(parseISO(exam.date), 'MMM d, yyyy')}</td>
                        <td className="px-6 py-4">
                          <Badge className={exam.score! >= 70 ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-orange-100 text-orange-700 hover:bg-orange-100"}>
                            {exam.score}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => deleteExam(exam.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {pastExams.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                          No past exam records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'study' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-4xl">
             <div className="flex items-center gap-3 mb-8">
                <div className="bg-accent p-3 rounded-2xl shadow-lg shadow-accent/20">
                  <BrainCircuit className="text-white h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI Study Assistant</h2>
                  <p className="text-muted-foreground">Choose an upcoming exam to generate a custom study plan.</p>
                </div>
             </div>

             {upcomingExams.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Select Target Exam</h3>
                     <div className="flex flex-col gap-3">
                        {upcomingExams.map((exam) => (
                          <div key={exam.id} className="group cursor-pointer">
                            <StudyPlanTool exam={exam} history={pastExams} />
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="hidden md:block">
                     <Card className="bg-primary/5 border-none h-full p-8 flex flex-col justify-center items-center text-center">
                        <div className="bg-white p-6 rounded-full shadow-lg mb-6">
                           <Sparkles className="h-10 w-10 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-4">Science-Backed Planning</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Our AI analyzes your historical performance to prioritize topics you've struggled with in the past, while leveraging your strengths to build a balanced study schedule.
                        </p>
                     </Card>
                  </div>
               </div>
             ) : (
               <Card className="p-12 text-center flex flex-col items-center border-dashed border-2">
                  <History className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">No upcoming exams found. Schedule an exam first to use the AI Study Assistant.</p>
                  <Button variant="link" onClick={() => setActiveTab('dashboard')} className="mt-2 text-primary">Back to Dashboard</Button>
               </Card>
             )}
          </div>
        )}
      </main>
    </div>
  );
}
