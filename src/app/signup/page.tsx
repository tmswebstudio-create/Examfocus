"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp } from "firebase/firestore";
import { LayoutDashboard } from "lucide-react";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Password too weak",
            description: "Password must be at least 6 characters long.",
        });
        return;
    }
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Create user profile in Firestore
      const userProfileRef = doc(firestore, `userProfiles/${newUser.uid}`);
      const userProfileData = {
        id: newUser.uid,
        firstName,
        lastName,
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      setDocumentNonBlocking(userProfileRef, userProfileData, { merge: true });

      toast({
        title: "Account Created!",
        description: "Welcome to ExamFocus. Redirecting you to the app...",
      });

      // The useEffect will handle the redirect once the user state is updated.
      
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "An unknown error occurred. The email might already be in use.",
      });
      setLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
                <p className="text-primary font-medium">Loading...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="bg-primary p-3 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="text-white h-6 w-6" />
                </div>
            </div>
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>Join ExamFocus to start tracking your exams.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
