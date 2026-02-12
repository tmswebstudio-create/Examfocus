"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Link as LinkIcon, ExternalLink, Globe, FileText, Youtube, Trash2, X } from "lucide-react";
import { type Resource, type ResourceLink } from "@/app/lib/resource-store";
import Image from "next/image";

interface ResourceCardProps {
  resource: Resource;
  onAddLink: (resourceId: string, link: Omit<ResourceLink, 'id'>) => void;
  onDelete: (id: string) => void;
  onRemoveLink: (resourceId: string, linkId: string) => void;
}

const ICON_OPTIONS = [
  { name: 'Globe', icon: Globe },
  { name: 'FileText', icon: FileText },
  { name: 'Youtube', icon: Youtube },
  { name: 'Link', icon: LinkIcon },
];

export function ResourceCard({ resource, onAddLink, onDelete, onRemoveLink }: ResourceCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Link");

  const handleAddLink = () => {
    if (!label || !url) return;
    onAddLink(resource.id, { label, url, icon: selectedIcon });
    setLabel("");
    setUrl("");
    setIsAdding(false);
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
                      className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                    >
                      <IconComp className="h-4 w-4" />
                      {link.label}
                      <ExternalLink className="h-3 w-3 opacity-50" />
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
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold tracking-wider opacity-60">Link URL</Label>
              <Input 
                placeholder="https://..." 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold tracking-wider opacity-60">Icon</Label>
              <div className="flex gap-2">
                {ICON_OPTIONS.map((opt) => (
                  <Button
                    key={opt.name}
                    variant={selectedIcon === opt.name ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedIcon(opt.name)}
                  >
                    <opt.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1" onClick={handleAddLink}>Add</Button>
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
