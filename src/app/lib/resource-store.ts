"use client";

import { useState, useEffect } from 'react';

export type ResourceLink = {
  id: string;
  label: string;
  url: string;
  icon: string;
};

export type Resource = {
  id: string;
  title: string;
  imageUrl: string;
  links: ResourceLink[];
};

const STORAGE_KEY = 'examfocus_resources';

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setResources(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse resources", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
    }
  }, [resources, isLoaded]);

  const addResource = (title: string, imageUrl: string) => {
    const newResource: Resource = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      imageUrl: imageUrl || `https://picsum.photos/seed/${Math.random()}/600/400`,
      links: [],
    };
    setResources(prev => [...prev, newResource]);
  };

  const updateResource = (id: string, updates: Partial<Omit<Resource, 'id' | 'links'>>) => {
    setResources(prev => prev.map(res => res.id === id ? { ...res, ...updates } : res));
  };

  const addLinkToResource = (resourceId: string, link: Omit<ResourceLink, 'id'>) => {
    setResources(prev => prev.map(res => {
      if (res.id === resourceId) {
        return {
          ...res,
          links: [...res.links, { ...link, id: Math.random().toString(36).substring(2, 9) }]
        };
      }
      return res;
    }));
  };

  const updateLinkInResource = (resourceId: string, linkId: string, updates: Partial<Omit<ResourceLink, 'id'>>) => {
    setResources(prev => prev.map(res => {
      if (res.id === resourceId) {
        return {
          ...res,
          links: res.links.map(l => l.id === linkId ? { ...l, ...updates } : l)
        };
      }
      return res;
    }));
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(res => res.id !== id));
  };

  const removeLinkFromResource = (resourceId: string, linkId: string) => {
    setResources(prev => prev.map(res => {
      if (res.id === resourceId) {
        return {
          ...res,
          links: res.links.filter(l => l.id !== linkId)
        };
      }
      return res;
    }));
  };

  return { 
    resources, 
    isLoaded, 
    addResource, 
    updateResource,
    addLinkToResource, 
    updateLinkInResource,
    deleteResource, 
    removeLinkFromResource 
  };
}
