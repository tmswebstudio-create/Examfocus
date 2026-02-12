"use client";

import { useMemo, useCallback } from 'react';
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// Define the shape of an exam, matching the Firestore entity
export type Exam = {
  id: string;
  userId: string;
  subject: string;
  syllabus?: string;
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
  const { data: exams, isLoading, error } = useCollection<Exam>(examsQuery);
  if(error) console.error(error);


  const addExam = useCallback((exam: Omit<Exam, 'id' | 'completed' | 'userId'>) => {
    if (!user || !examsQuery) return;
    const newExam = {
      ...exam,
      userId: user.uid,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    addDocumentNonBlocking(examsQuery, newExam);
  }, [user, examsQuery]);

  const updateExam = useCallback((id: string, updates: Partial<Omit<Exam, 'id' | 'userId'>>) => {
    if (!user || !examsCollectionPath) return;
    const docRef = doc(firestore, examsCollectionPath, id);
    updateDocumentNonBlocking(docRef, { ...updates, updatedAt: serverTimestamp() });
  }, [user, firestore, examsCollectionPath]);

  const deleteExam = useCallback((id: string) => {
    if (!user || !examsCollectionPath) return;
    const docRef = doc(firestore, examsCollectionPath, id);
    deleteDocumentNonBlocking(docRef);
  }, [user, firestore, examsCollectionPath]);

  const markCompleted = useCallback((id: string, gainedMark: number, totalMark: number) => {
    const score = totalMark > 0 ? Math.round((gainedMark / totalMark) * 100) : 0;
    updateExam(id, { 
      completed: true, 
      score, 
      gainedMark, 
      totalMark 
    });
  }, [updateExam]);

  return { exams: exams || [], isLoading, addExam, updateExam, deleteExam, markCompleted };
}
