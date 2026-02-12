'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from '@/hooks/use-user-profile';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';


export function EditProfileDialog() {
  const { userProfile, isProfileLoading } = useUserProfile();
  const { user } = useUser();
  const firestore = useFirestore();
  const [open, setOpen] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    // When the dialog opens, populate the form with the latest user profile data.
    if (open && userProfile) {
      setFirstName(userProfile.firstName || '');
      setLastName(userProfile.lastName || '');
      setPhotoURL(userProfile.photoURL || '');
    }
  }, [open, userProfile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const profileRef = doc(firestore, `userProfiles/${user.uid}`);
    const updates = {
      firstName,
      lastName,
      photoURL,
      updatedAt: serverTimestamp(),
    };
    updateDocumentNonBlocking(profileRef, updates);
    toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
    });
    setOpen(false);
  };
  
  if (isProfileLoading || !userProfile || !user) {
      return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <User className="mr-2 h-4 w-4" />
            <span>Manage Account</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="photoURL">Photo URL</Label>
            <Input id="photoURL" placeholder="https://example.com/photo.jpg" value={photoURL || ''} onChange={(e) => setPhotoURL(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
