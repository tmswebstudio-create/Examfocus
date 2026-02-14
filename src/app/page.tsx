"use client";

import { useExams } from "@/hooks/use-exams";
import { useResources } from "@/hooks/use-resources";
import { AddExamDialog } from "@/components/exam/AddExamDialog";
import { EditExamDialog } from "@/components/exam/EditExamDialog";
import { ExamCountdown } from "@/components/exam/Countdown";
import { MarkCompleteDialog } from "@/components/exam/MarkCompleteDialog";
import { PerformanceDashboard } from "@/components/dashboard/PerformanceDashboard";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { AddResourceDialog } from "@/components/resources/AddResourceDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, History, LayoutDashboard, Trash2, Clock, Library, BookOpen, Info } from "lucide-react";
import { format, parseISO, isPast } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array];
  const [item] = newArray.splice(from, 1);
  if (item) {
    newArray.splice(to, 0, item);
  }
  return newArray;
}

const NextExamSkeleton = () => (
  <Card className="border-none bg-gradient-to-r from-primary/80 to-accent/80 text-white shadow-xl shadow-primary/20 overflow-hidden relative flex flex-col">
    <CardHeader className="relative pb-4">
      <Skeleton className="h-5 w-24 bg-white/30 rounded-md" />
      <Skeleton className="h-8 w-4/5 mt-2 bg-white/30 rounded-md" />
    </CardHeader>
    <CardContent className="flex-1 pt-0 space-y-3 text-sm">
      <Skeleton className="h-5 w-3/5 bg-white/30 rounded-md" />
      <Skeleton className="h-5 w-4/5 bg-white/30 rounded-md" />
      <div className="mt-4">
        <Skeleton className="h-28 w-full bg-white/20 rounded-xl" />
      </div>
    </CardContent>
    <div className="p-4 bg-black/10 flex items-center justify-between">
      <Skeleton className="h-10 w-28 bg-white/30 rounded-md" />
      <Skeleton className="h-8 w-8 rounded-md bg-white/30" />
    </div>
  </Card>
);

const PerformanceDashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2 mb-1" />
            <Skeleton className="h-3 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="border-none shadow-sm">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  </div>
);

const ExamCardSkeleton = () => (
  <Card className="border-none shadow-sm bg-white overflow-hidden flex flex-col">
    <div className="h-2 bg-muted"></div>
    <CardHeader className="relative pb-3">
      <Skeleton className="h-5 w-3/4" />
    </CardHeader>
    <CardContent className="flex-1 pt-0 space-y-3 text-sm">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="mt-4">
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </CardContent>
    <div className="p-4 bg-muted/10 flex items-center justify-between">
      <Skeleton className="h-9 w-24 rounded-md" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  </Card>
);

const HistoryTableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[640px]">
        <thead className="bg-muted/30 border-b border-border">
          <tr>
            {[...Array(7)].map((_, i) => (
              <th key={i} className="px-6 py-4">
                <Skeleton className="h-5 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b border-border/50 last:border-none">
              <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
              <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
              <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
              <td className="px-6 py-4"><Skeleton className="h-5 w-40" /></td>
              <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
              <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ResourceCardSkeleton = () => (
  <Card className="overflow-hidden group border-none shadow-sm bg-white flex flex-col h-full">
    <Skeleton className="h-48 w-full" />
    <CardHeader className="pb-3">
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent className="flex-1 flex flex-col gap-4">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </CardContent>
  </Card>
);

export default function Home() {
  const { user, isUserLoading } = useUser();
  const { userProfile, isProfileLoading } = useUserProfile();
  const router = useRouter();

  const { exams, isLoading: examsLoading, addExam, updateExam, markCompleted, deleteExam } = useExams();
  const { 
    resources, 
    isLoading: resourcesLoading, 
    addResource, 
    updateResource, 
    addLinkToResource, 
    updateLinkInResource,
    deleteResource, 
    removeLinkFromResource,
    setResourcesOrder,
  } = useResources();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const categories = useMemo(() => {
    if (!exams) return ['all'];
    const uniqueCategories = new Set(exams.map(e => e.category).filter(Boolean) as string[]);
    return ['all', ...Array.from(uniqueCategories)];
  }, [exams]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = resources.findIndex((r) => r.id === active.id);
      const newIndex = resources.findIndex((r) => r.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrderedResources = arrayMove(resources, oldIndex, newIndex);
        setResourcesOrder(newOrderedResources);
      }
    }
  }

  const upcomingExams = useMemo(() => exams
    .filter(e => {
      const examDateTime = new Date(`${e.date}T${e.time || '23:59:59'}`);
      return !e.completed && !isPast(examDateTime);
    })
    .filter(e => selectedCategory === 'all' || e.category === selectedCategory)
    .sort((a, b) => {
        const aDateTime = new Date(`${a.date}T${a.time || '00:00:00'}`).getTime();
        const bDateTime = new Date(`${b.date}T${b.time || '00:00:00'}`).getTime();
        return aDateTime - bDateTime;
    }), [exams, selectedCategory]);
  
  const pastExams = useMemo(() => exams
    .filter(e => {
      const examDateTime = new Date(`${e.date}T${e.time || '23:59:59'}`);
      return e.completed || isPast(examDateTime);
    })
    .filter(e => selectedCategory === 'all' || e.category === selectedCategory)
    .sort((a, b) => {
        const aDateTime = new Date(`${a.date}T${a.time || '00:00:00'}`).getTime();
        const bDateTime = new Date(`${b.date}T${b.time || '00:00:00'}`).getTime();
        return bDateTime - aDateTime;
    }), [exams, selectedCategory]);

  const nextExam = upcomingExams[0];

  if (isUserLoading || (!user && !isUserLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
          <p className="text-primary font-medium">Focusing...</p>
        </div>
      </div>
    );
  }

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
          <a href="https://examfocus.vercel.app/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <LayoutDashboard className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary hidden sm:inline-block">ExamFocus</span>
          </a>

          <div className="flex items-center gap-1 md:gap-4">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                  "gap-2",
                  activeTab === item.id
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-primary hover:text-primary-foreground"
                )}
                onClick={() => {
                  setActiveTab(item.id)
                  setSelectedCategory("all")
                }}
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
            <ProfileDropdown />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <header className="mb-10">
              {isProfileLoading ? (
                <>
                  <Skeleton className="h-9 w-1/2 rounded-lg" />
                  <Skeleton className="h-5 w-3/4 mt-2 rounded-lg" />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-foreground">Welcome back, {userProfile?.firstName || 'Student'}!</h1>
                  <p className="text-muted-foreground mt-1">Stay focused and track your academic journey.</p>
                </>
              )}
            </header>

            {/* Featured Next Exam */}
            {examsLoading ? (
              <NextExamSkeleton />
            ) : nextExam ? (
              <Card className="border-none bg-gradient-to-r from-primary to-accent text-white shadow-xl shadow-primary/20 overflow-hidden relative flex flex-col">
                <div className="absolute -right-10 -top-10 bg-white/10 rounded-full h-40 w-40 blur-3xl"></div>
                <CardHeader className="relative pb-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="w-fit text-white border-white/40 bg-white/10 mb-2">Next Milestone</Badge>
                    <div className="absolute top-4 right-4">
                      <EditExamDialog exam={nextExam} onUpdate={updateExam} triggerVariant="featured-icon" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight pr-8">{nextExam.subject}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pt-0 space-y-3 text-sm">
                  <div className="flex items-center gap-2 opacity-80">
                    <Calendar className="h-4 w-4" />
                    <span>{format(parseISO(nextExam.date), 'EEE, MMM d, yyyy')}</span>
                    {nextExam.time && (
                        <>
                            <span className="opacity-50">|</span>
                            <Clock className="h-4 w-4" />
                            <span>{format(parseISO(`1970-01-01T${nextExam.time}`), 'p')}</span>
                        </>
                    )}
                  </div>
                  {nextExam.syllabus && (
                    <div className="flex items-start gap-2 opacity-80">
                      <BookOpen className="h-4 w-4 mt-0.5 shrink-0" />
                      <p><span className="font-semibold opacity-100">Syllabus:</span> {nextExam.syllabus}</p>
                    </div>
                  )}
                  {nextExam.notes && (
                    <div className="flex items-start gap-2 opacity-80">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" />
                      <p><span className="font-semibold opacity-100">Extra Notes:</span> {nextExam.notes}</p>
                    </div>
                  )}
                  <div className="mt-4 flex justify-center">
                    <ExamCountdown date={nextExam.date} time={nextExam.time} variant="featured" />
                  </div>
                </CardContent>
                <div className="p-4 bg-black/10 flex items-center justify-between">
                  <MarkCompleteDialog
                    examSubject={nextExam.subject}
                    onComplete={(g, t) => markCompleted(nextExam.id, g, t)}
                    variant="featured"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/70 hover:text-white hover:bg-white/20 h-8 w-8"
                    onClick={() => deleteExam(nextExam.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
              {examsLoading ? <PerformanceDashboardSkeleton /> : <PerformanceDashboard exams={exams} />}
            </div>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Upcoming Exams</h2>
                <div className="flex items-center gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant="secondary">{upcomingExams.length} Scheduled</Badge>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {examsLoading ? (
                  <>
                    <ExamCardSkeleton />
                    <ExamCardSkeleton />
                    <ExamCardSkeleton />
                  </>
                ) : upcomingExams.length > 0 ? (
                  upcomingExams.map((exam) => (
                    <Card key={exam.id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden flex flex-col">
                      <div className="h-2 bg-primary"></div>
                      <CardHeader className="relative pb-3">
                        <CardTitle className="text-lg leading-tight pr-8">{exam.subject}</CardTitle>
                        <div className="absolute top-4 right-4">
                          <EditExamDialog exam={exam} onUpdate={updateExam} />
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pt-0 space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{format(parseISO(exam.date), 'EEE, MMM d, yyyy')}</span>
                            {exam.time && (
                              <>
                                  <span className="text-muted-foreground/50">|</span>
                                  <Clock className="h-4 w-4" />
                                  <span>{format(parseISO(`1970-01-01T${exam.time}`), 'p')}</span>
                              </>
                            )}
                        </div>
                        {exam.syllabus && (
                            <div className="flex items-start gap-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <p><span className="font-semibold">Syllabus:</span> {exam.syllabus}</p>
                            </div>
                        )}
                        {exam.notes && (
                            <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <p><span className="font-semibold">Extra Notes:</span> {exam.notes}</p>
                            </div>
                        )}
                        <div className="mt-4 flex justify-center">
                            <ExamCountdown date={exam.date} time={exam.time} variant="default" />
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
                  ))
                ) : (
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
              <div className="flex items-center gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge className="bg-accent text-white">{pastExams.filter(e => e.completed).length} Completed</Badge>
              </div>
            </div>
            {examsLoading ? <HistoryTableSkeleton /> : (
              <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[640px]">
                      <thead className="bg-muted/30 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Exam Title</th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Category</th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Date</th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Syllabus</th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Score</th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Result (%)</th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastExams.length > 0 ? (
                          pastExams.map((exam) => (
                            <tr key={exam.id} className="border-b border-border/50 last:border-none hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-4 font-medium">{exam.subject}</td>
                              <td className="px-6 py-4 text-muted-foreground text-sm">{exam.category || 'N/A'}</td>
                              <td className="px-6 py-4 text-muted-foreground text-sm">{format(parseISO(exam.date), 'MMM d, yyyy')}</td>
                              <td className="px-6 py-4 text-muted-foreground text-sm max-w-xs truncate">{exam.syllabus || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm font-medium">
                                {exam.gainedMark !== undefined ? `${exam.gainedMark} / ${exam.totalMark}`: 'N/A'}
                              </td>
                              <td className="px-6 py-4">
                                {exam.score !== undefined ? (
                                  <Badge className={exam.score! >= 70 ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none"}>
                                    {exam.score}%
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">Pending</Badge>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {!exam.completed && (
                                    <MarkCompleteDialog
                                      examSubject={exam.subject}
                                      onComplete={(g, t) => markCompleted(exam.id, g, t)}
                                    />
                                  )}
                                  <EditExamDialog exam={exam} onUpdate={updateExam} />
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                                    onClick={() => deleteExam(exam.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                              No past exam records found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold">Study Resources</h2>
              <p className="text-muted-foreground">Keep all your study materials, cheat sheets, and references in one place.</p>
            </div>

            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={resources.map(r => r.id)}
                strategy={rectSortingStrategy}
              >
                {resourcesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ResourceCardSkeleton />
                    <ResourceCardSkeleton />
                    <ResourceCardSkeleton />
                  </div>
                ) : resources.length > 0 ? (
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
              </SortableContext>
            </DndContext>
          </div>
        )}
      </main>
    </div>
  );
}
