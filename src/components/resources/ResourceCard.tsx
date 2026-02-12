"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, Link as LinkIcon, ExternalLink, Globe, FileText, Youtube, Trash2, X,
  Video, BookOpen, Github, Code, Image as ImageIcon, MonitorPlay, Database, Mail, 
  MessageSquare, Linkedin, Twitter, Book, GraduationCap, School, Pencil, Library, 
  Calculator, Microscope, Terminal, Cpu, Cloud, Wifi, Music, Headphones, Camera, 
  Star, Heart, Bookmark, Flag, Info, HelpCircle, Check, Settings, Download, File, 
  Folder, Map, Pin, Search, Facebook, Instagram, Slack, Send
} from "lucide-react";
import { type Resource, type ResourceLink } from "@/app/lib/resource-store";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
  resource: Resource;
  onAddLink: (resourceId: string, link: Omit<ResourceLink, 'id'>) => void;
  onDelete: (id: string) => void;
  onRemoveLink: (resourceId: string, linkId: string) => void;
}

const ICON_OPTIONS = [
  { name: 'Link', icon: LinkIcon },
  { name: 'Book', icon: Book },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Library', icon: Library },
  { name: 'School', icon: School },
  { name: 'Pencil', icon: Pencil },
  { name: 'Calculator', icon: Calculator },
  { name: 'Microscope', icon: Microscope },
  { name: 'Globe', icon: Globe },
  { name: 'Github', icon: Github },
  { name: 'Code', icon: Code },
  { name: 'Terminal', icon: Terminal },
  { name: 'Database', icon: Database },
  { name: 'Cpu', icon: Cpu },
  { name: 'Cloud', icon: Cloud },
  { name: 'Wifi', icon: Wifi },
  { name: 'Youtube', icon: Youtube },
  { name: 'Video', icon: Video },
  { name: 'MonitorPlay', icon: MonitorPlay },
  { name: 'Camera', icon: Camera },
  { name: 'Image', icon: ImageIcon },
  { name: 'Music', icon: Music },
  { name: 'Headphones', icon: Headphones },
  { name: 'Mail', icon: Mail },
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'Slack', icon: Slack },
  { name: 'Send', icon: Send },
  { name: 'Twitter', icon: Twitter },
  { name: 'Linkedin', icon: Linkedin },
  { name: 'Facebook', icon: Facebook },
  { name: 'Instagram', icon: Instagram },
  { name: 'Star', icon: Star },
  { name: 'Heart', icon: Heart },
  { name: 'Bookmark', icon: Bookmark },
  { name: 'Flag', icon: Flag },
  { name: 'Info', icon: Info },
  { name: 'Help', icon: HelpCircle },
  { name: 'Check', icon: Check },
  { name: 'Settings', icon: Settings },
  { name: 'File', icon: File },
  { name: 'FileText', icon: FileText },
  { name: 'Folder', icon: Folder },
  { name: 'Download', icon: Download },
  { name: 'Map', icon: Map },
  { name: 'Pin', icon: Pin },
];

export function ResourceCard({ resource, onAddLink, onDelete, onRemoveLink }: ResourceCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Link");
  const [iconSearch, setIconSearch] = useState("");

  const filteredIcons = useMemo(() => {
    return ICON_OPTIONS.filter(opt => 
      opt.name.toLowerCase().includes(iconSearch.toLowerCase())
    );
  }, [iconSearch]);

  const handleAddLink = () => {
    if (!label || !url) return;
    onAddLink(resource.id, { label, url, icon: selectedIcon });
    setLabel("");
    setUrl("");
    setIsAdding(false);
    setIconSearch("");
  };

  return (
    <Card className="overflow-hidden group border-none shadow-sm hover:shadow-md transition-all bg-white flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image 
          src={resource.imageUrl} 
          alt={resource.title} 
          fill 
          className="object-cover"
          data-ai-hint="educational resource"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <Button 
          variant="destructive" 
          size="icon" 
          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(resource.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">{resource.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="space-y-2 flex-1">
          {resource.links.length > 0 ? (
            <div className="grid gap-2">
              {resource.links.map((link) => {
                const IconComp = ICON_OPTIONS.find(o => o.name === link.icon)?.icon || LinkIcon;
                return (
                  <div key={link.id} className="flex items-center justify-between group/link bg-muted/30 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-sm text-primary hover:underline font-medium truncate"
                    >
                      <IconComp className="h-4 w-4 shrink-0" />
                      <span className="truncate">{link.label}</span>
                      <ExternalLink className="h-3 w-3 opacity-50 shrink-0" />
                    </a>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive opacity-0 group-hover/link:opacity-100 transition-opacity"
                      onClick={() => onRemoveLink(resource.id, link.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No links added yet.</p>
          )}
        </div>

        {isAdding ? (
          <div className="bg-muted/50 p-4 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold tracking-wider opacity-60">Label</Label>
              <Input 
                placeholder="e.g. Video Tutorial" 
                value={label} 
                onChange={(e) => setLabel(e.target.value)}
                className="h-8 text-sm bg-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold tracking-wider opacity-60">Link URL</Label>
              <Input 
                placeholder="https://..." 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                className="h-8 text-sm bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase font-bold tracking-wider opacity-60">Select Icon</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input 
                    placeholder="Search icons..." 
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    className="h-7 text-[10px] pl-7 w-32 bg-white"
                  />
                </div>
              </div>
              <ScrollArea className="h-24 bg-white rounded-md border p-2">
                <div className="grid grid-cols-6 gap-2">
                  {filteredIcons.map((opt) => (
                    <Button
                      key={opt.name}
                      type="button"
                      variant={selectedIcon === opt.name ? "default" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        selectedIcon === opt.name ? "bg-primary text-white" : "hover:bg-primary/10 text-muted-foreground"
                      )}
                      onClick={() => setSelectedIcon(opt.name)}
                      title={opt.name}
                    >
                      <opt.icon className="h-4 w-4" />
                    </Button>
                  ))}
                  {filteredIcons.length === 0 && (
                    <p className="col-span-full text-[10px] text-center text-muted-foreground py-2">No icons found</p>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1 bg-primary" onClick={handleAddLink}>Add Link</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
