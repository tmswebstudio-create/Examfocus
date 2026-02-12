"use client";

import { useMemo } from 'react';
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// Define the shape of an exam, matching the Firestore entity
export type Exam = {
  id: string;
  userId: string;
  subject: string;
  date: string; // YYYY-MM-DD
  notes?: string;
  completed: boolean;
  score?: number; // Percentage
  gainedMark?: number;
  totalMark?: number;
  createdAt?: any; // Firestore timestamp
  updatedAt?: any; // Firestore timestamp
};

export function useExams() {
  const { user } = useUser();
  const firestore = useFirestore();

  const examsCollectionPath = user ? `/userProfiles/${user.uid}/exams` : null;

  // Memoize the collection reference
  const examsQuery = useMemoFirebase(() => 
    examsCollectionPath ? collection(firestore, examsCollectionPath) : null
  , [firestore, examsCollectionPath]);

  // Subscribe to the collection
  const { data: exams, isLoading: isLoaded, error } = useCollection<Exam>(examsQuery);
  if(error) console.error(error);


  const addExam = (exam: Omit<Exam, 'id' | 'completed' | 'userId'>) => {
    if (!user || !examsQuery) return;
    const newExam = {
      ...exam,
      userId: user.uid,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    addDocumentNonBlocking(examsQuery, newExam);
  };

  const updateExam = (id: string, updates: Partial<Omit<Exam, 'id' | 'userId'>>) => {
    if (!user || !examsCollectionPath) return;
    const docRef = doc(firestore, examsCollectionPath, id);
    updateDocumentNonBlocking(docRef, { ...updates, updatedAt: serverTimestamp() });
  };

  const deleteExam = (id: string) => {
    if (!user || !examsCollectionPath) return;
    const docRef = doc(firestore, examsCollectionPath, id);
    deleteDocumentNonBlocking(docRef);
  };

  const markCompleted = (id: string, gainedMark: number, totalMark: number) => {
    const score = totalMark > 0 ? Math.round((gainedMark / totalMark) * 100) : 0;
    updateExam(id, { 
      completed: true, 
      score, 
      gainedMark, 
      totalMark 
    });
  };

  return { exams: exams || [], isLoaded, addExam, updateExam, deleteExam, markCompleted };
}
