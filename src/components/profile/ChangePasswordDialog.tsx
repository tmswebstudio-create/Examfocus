'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

interface ChangePasswordDialogProps {
    email: string;
}

export function ChangePasswordDialog({ email }: ChangePasswordDialogProps) {
    const auth = useAuth();
    const { toast } = useToast();

    const handlePasswordReset = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                toast({
                    title: "Password Reset Email Sent",
                    description: `An email has been sent to ${email} with instructions to reset your password.`,
                });
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message || "Failed to send password reset email.",
                });
            });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger className="w-full">
                <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <Lock className="mr-2 h-4 w-4" />
                    <span>Change Password</span>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Change Your Password?</AlertDialogTitle>
                    <AlertDialogDescription>
                        We will send a password reset link to your email address: <strong>{email}</strong>. Please check your inbox to proceed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePasswordReset}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
