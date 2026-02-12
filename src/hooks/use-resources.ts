"use client";

import { useMemo, useCallback } from 'react';
import { collection, doc, serverTimestamp, arrayUnion, arrayRemove, query, orderBy } from "firebase/firestore";
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
  displayOrder?: number;
  createdAt?: any;
  updatedAt?: any;
};

export function useResources() {
  const { user } = useUser();
  const firestore = useFirestore();

  const resourcesCollectionPath = user ? `/userProfiles/${user.uid}/resources` : null;
  const resourcesQuery = useMemoFirebase(() => 
    resourcesCollectionPath ? query(collection(firestore, resourcesCollectionPath), orderBy("displayOrder", "asc")) : null
  , [firestore, resourcesCollectionPath]);

  const { data: resources, isLoading, error } = useCollection<Resource>(resourcesQuery);
  if(error) console.error(error);

  const addResource = useCallback((title: string, imageUrl: string) => {
    if (!user || !resourcesCollectionPath) return;
    const collectionRef = collection(firestore, resourcesCollectionPath);
    const newResource = {
      userId: user.uid,
      title,
      imageUrl: imageUrl || `https://picsum.photos/seed/${Math.random()}/600/400`,
      links: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      displayOrder: resources?.length ?? 0,
    };
    addDocumentNonBlocking(collectionRef, newResource);
  }, [user, firestore, resourcesCollectionPath, resources?.length]);
  
  const updateResource = useCallback((id: string, updates: Partial<Omit<Resource, 'id' | 'links' | 'userId'>>) => {
    if (!user || !resourcesCollectionPath) return;
    const docRef = doc(firestore, resourcesCollectionPath, id);
    updateDocumentNonBlocking(docRef, { ...updates, updatedAt: serverTimestamp() });
  }, [user, firestore, resourcesCollectionPath]);

  const deleteResource = useCallback((id: string) => {
    if (!user || !resourcesCollectionPath) return;
    const docRef = doc(firestore, resourcesCollectionPath, id);
    deleteDocumentNonBlocking(docRef);
  }, [user, firestore, resourcesCollectionPath]);

  const addLinkToResource = useCallback((resourceId: string, link: Omit<ResourceLink, 'id'>) => {
    if (!user || !resourcesCollectionPath) return;
    const docRef = doc(firestore, resourcesCollectionPath, resourceId);
    const newLink = { ...link, id: Math.random().toString(36).substring(2, 9) };
    updateDocumentNonBlocking(docRef, { links: arrayUnion(newLink) });
  }, [user, firestore, resourcesCollectionPath]);

  const updateLinkInResource = useCallback((resourceId: string, linkId: string, updates: Partial<Omit<ResourceLink, 'id'>>) => {
    if (!resources) return;
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const updatedLinks = resource.links.map(l => 
      l.id === linkId ? { ...l, ...updates } : l
    );
    updateResource(resourceId, { links: updatedLinks });
  }, [resources, updateResource]);
  
  const removeLinkFromResource = useCallback((resourceId: string, linkId: string) => {
    if (!resources) return;
    const resource = resources.find(r => r.id === resourceId);
    const linkToRemove = resource?.links.find(l => l.id === linkId);
    if (!resource || !linkToRemove || !resourcesCollectionPath) return;

    const docRef = doc(firestore, resourcesCollectionPath, resourceId);
    updateDocumentNonBlocking(docRef, { links: arrayRemove(linkToRemove) });
  }, [resources, firestore, resourcesCollectionPath]);

  const setResourcesOrder = useCallback((orderedResources: Resource[]) => {
    if (!user || !resourcesCollectionPath) return;

    orderedResources.forEach((resource, index) => {
        if (resource.displayOrder !== index) {
            const docRef = doc(firestore, resourcesCollectionPath, resource.id);
            updateDocumentNonBlocking(docRef, { displayOrder: index });
        }
    });
  }, [user, firestore, resourcesCollectionPath]);


  return { 
    resources: resources || [], 
    isLoading, 
    addResource, 
    updateResource,
    addLinkToResource, 
    updateLinkInResource,
    deleteResource, 
    removeLinkFromResource,
    setResourcesOrder
  };
}
