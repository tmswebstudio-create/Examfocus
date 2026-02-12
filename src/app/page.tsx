"use client";

import { useExams } from "@/app/lib/exam-store";
import { useResources } from "@/app/lib/resource-store";
import { AddExamDialog } from "@/components/exam/AddExamDialog";
import { EditExamDialog } from "@/components/exam/EditExamDialog";
import { ExamCountdown } from "@/components/exam/Countdown";
import { MarkCompleteDialog } from "@/components/exam/MarkCompleteDialog";
import { PerformanceDashboard } from "@/components/dashboard/PerformanceDashboard";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { AddResourceDialog } from "@/components/resources/AddResourceDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, History, LayoutDashboard, Trash2, Clock, Library, BookOpen, Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Home() {
  const { exams, isLoaded: examsLoaded, addExam, updateExam, markCompleted, deleteExam } = useExams();
  const { 
    resources, 
    isLoaded: resourcesLoaded, 
    addResource, 
    updateResource, 
    addLinkToResource, 
    updateLinkInResource,
    deleteResource, 
    removeLinkFromResource 
  } = useResources();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!examsLoaded || !resourcesLoaded) {
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

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'upcoming', label: 'Upcoming', icon: Clock },
    { id: 'history', label: 'History', icon: History },
    { id: 'resources', label: 'Resources', icon: Library },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky Top Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <LayoutDashboard className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary hidden sm:inline-block">ExamFocus</span>
          </div>

          <div className="flex items-center gap-1 md:gap-4">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                  "gap-2",
                  activeTab === item.id && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'resources' ? (
              <AddResourceDialog onAdd={addResource} />
            ) : (
              <AddExamDialog onAdd={addExam} />
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10 overflow-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Student!</h1>
          <p className="text-muted-foreground mt-1">Stay focused and track your academic journey.</p>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Featured Next Exam */}
            {nextExam ? (
              <Card className="border-none bg-gradient-to-r from-primary to-accent text-white shadow-xl shadow-primary/20 overflow-hidden relative">
                <div className="absolute -right-10 -top-10 bg-white/10 rounded-full h-40 w-40 blur-3xl"></div>
                <CardHeader className="pb-2">
                   <div className="flex justify-between items-start">
                     <Badge variant="outline" className="w-fit text-white border-white/40 bg-white/10 mb-2">Next Milestone</Badge>
                     <EditExamDialog exam={nextExam} onUpdate={updateExam} triggerVariant="icon" />
                   </div>
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
                      <MarkCompleteDialog 
                        examSubject={nextExam.subject} 
                        onComplete={(g, t) => markCompleted(nextExam.id, g, t)} 
                      />
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
                    <CardHeader className="relative">
                      <CardTitle className="text-lg leading-tight pr-8">{exam.subject}</CardTitle>
                      <div className="absolute top-4 right-4">
                        <EditExamDialog exam={exam} onUpdate={updateExam} />
                      </div>
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
                      <MarkCompleteDialog 
                        examSubject={exam.subject} 
                        onComplete={(g, t) => markCompleted(exam.id, g, t)} 
                      />
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
                      <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Score</th>
                      <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Result (%)</th>
                      <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastExams.map((exam) => (
                      <tr key={exam.id} className="border-b border-border/50 last:border-none hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 font-medium">{exam.subject}</td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">{format(parseISO(exam.date), 'MMM d, yyyy')}</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {exam.gainedMark} / {exam.totalMark}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={exam.score! >= 70 ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none"}>
                            {exam.score}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <EditExamDialog exam={exam} onUpdate={updateExam} />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => deleteExam(exam.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pastExams.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          No past exam records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold">Study Resources</h2>
              <p className="text-muted-foreground">Keep all your study materials, cheat sheets, and references in one place.</p>
            </div>

            {resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    onAddLink={addLinkToResource}
                    onUpdateLink={updateLinkInResource}
                    onUpdateResource={updateResource}
                    onDelete={deleteResource}
                    onRemoveLink={removeLinkFromResource}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-20 text-center flex flex-col items-center border-dashed border-2">
                <div className="bg-muted/50 p-6 rounded-full mb-6">
                  <BookOpen className="h-12 w-12 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-xl font-bold mb-2">Build Your Library</h3>
                <p className="text-muted-foreground max-w-sm mb-8">
                  Add resource cards for different subjects and attach links to videos, articles, or PDF documents.
                </p>
                <AddResourceDialog onAdd={addResource} />
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
