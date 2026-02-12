"use client";

import { useMemo } from 'react';
import { doc } from "firebase/firestore";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  createdAt: any;
  updatedAt: any;
}

export function useUserProfile() {
  const { user } = useUser();
  const firestore = useFirestore();

  const profilePath = user ? `/userProfiles/${user.uid}` : null;

  const profileDocRef = useMemoFirebase(() => 
    profilePath ? doc(firestore, profilePath) : null
  , [firestore, profilePath]);

  const { data: userProfile, isLoading: isProfileLoading, error } = useDoc<UserProfile>(profileDocRef);
  if(error) console.error(error);

  return { userProfile, isProfileLoading };
}
