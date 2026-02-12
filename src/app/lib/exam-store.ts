"use client";

import { useState, useEffect } from 'react';

export type Exam = {
  id: string;
  subject: string;
  date: string; // YYYY-MM-DD
  notes?: string;
  completed: boolean;
  score?: number;
};

const STORAGE_KEY = 'examfocus_exams';

export function useExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setExams(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse exams", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
    }
  }, [exams, isLoaded]);

  const addExam = (exam: Omit<Exam, 'id' | 'completed' | 'score'>) => {
    const newExam: Exam = {
      ...exam,
      id: Math.random().toString(36).substring(2, 9),
      completed: false,
    };
    setExams(prev => [...prev, newExam]);
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const markCompleted = (id: string, score: number) => {
    updateExam(id, { completed: true, score });
  };

  return { exams, isLoaded, addExam, updateExam, deleteExam, markCompleted };
}