"use client";

import { useMemo } from 'react';
import { collection, doc, serverTimestamp, arrayUnion, arrayRemove } from "firebase/firestore";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export type ResourceLink = {
  id: string;
  label: string;
  url: string;
  icon: string;
};

export type Resource = {
  id: string;
  userId: string;
  title: string;
  imageUrl: string;
  links: ResourceLink[];
  createdAt?: any;
  updatedAt?: any;
};

export function useResources() {
  const { user } = useUser();
  const firestore = useFirestore();

  const resourcesCollectionPath = user ? `/userProfiles/${user.uid}/resources` : null;
  const resourcesQuery = useMemoFirebase(() => 
    resourcesCollectionPath ? collection(firestore, resourcesCollectionPath) : null
  , [firestore, resourcesCollectionPath]);

  const { data: resources, isLoading: isLoaded, error } = useCollection<Resource>(resourcesQuery);
  if(error) console.error(error);

  const addResource = (title: string, imageUrl: string) => {
    if (!user || !resourcesQuery) return;
    const newResource = {
      userId: user.uid,
      title,
      imageUrl: imageUrl || `https://picsum.photos/seed/${Math.random()}/600/400`,
      links: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    addDocumentNonBlocking(resourcesQuery, newResource);
  };
  
  const updateResource = (id: string, updates: Partial<Omit<Resource, 'id' | 'links' | 'userId'>>) => {
    if (!user || !resourcesCollectionPath) return;
    const docRef = doc(firestore, resourcesCollectionPath, id);
    updateDocumentNonBlocking(docRef, { ...updates, updatedAt: serverTimestamp() });
  };

  const deleteResource = (id: string) => {
    if (!user || !resourcesCollectionPath) return;
    const docRef = doc(firestore, resourcesCollectionPath, id);
    deleteDocumentNonBlocking(docRef);
  };

  const addLinkToResource = (resourceId: string, link: Omit<ResourceLink, 'id'>) => {
    if (!user || !resourcesCollectionPath) return;
    const docRef = doc(firestore, resourcesCollectionPath, resourceId);
    const newLink = { ...link, id: Math.random().toString(36).substring(2, 9) };
    updateDocumentNonBlocking(docRef, { links: arrayUnion(newLink) });
  };

  const updateLinkInResource = (resourceId: string, linkId: string, updates: Partial<Omit<ResourceLink, 'id'>>) => {
    if (!resources) return;
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const updatedLinks = resource.links.map(l => 
      l.id === linkId ? { ...l, ...updates } : l
    );
    updateResource(resourceId, { links: updatedLinks });
  };
  
  const removeLinkFromResource = (resourceId: string, linkId: string) => {
    if (!resources) return;
    const resource = resources.find(r => r.id === resourceId);
    const linkToRemove = resource?.links.find(l => l.id === linkId);
    if (!resource || !linkToRemove || !resourcesCollectionPath) return;

    const docRef = doc(firestore, resourcesCollectionPath, resourceId);
    updateDocumentNonBlocking(docRef, { links: arrayRemove(linkToRemove) });
  };


  return { 
    resources: resources || [], 
    isLoaded, 
    addResource, 
    updateResource,
    addLinkToResource, 
    updateLinkInResource,
    deleteResource, 
    removeLinkFromResource 
  };
}
