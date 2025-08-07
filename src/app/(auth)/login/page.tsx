'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Building2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GoogleIcon = () => (
  <>
    <svg viewBox="0 0 48 48" className="h-5 w-5">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.426 44 30.659 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  </>
);

function VerifyRequest() {
  return (
    <Card className="w-full max-w-md shadow-2xl rounded-xl text-center">
      <CardHeader>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl font-headline">Check your email</CardTitle>
        <CardDescription>
          A sign-in link has been sent to your email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Please check your inbox and click the link to complete the sign in process. You can close this tab.
        </p>
      </CardContent>
    </Card>
  );
}

function SignInForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/dashboard',
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      if (!result?.ok) {
        throw new Error("Could not send sign-in link. Please try again.");
      }
      // NextAuth handles the redirect to the verifyRequest page automatically.
      // We don't need to manually redirect here.
    } catch (error) {
      toast({
        title: 'Sign-in Failed',
        description: (error as Error).message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl rounded-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Building2 className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl font-headline">CampusVenue</CardTitle>
        <CardDescription>
          The unified platform for campus venue booking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          size="lg"
          className="w-full"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          <GoogleIcon />
          Sign in with Google
        </Button>
        <div className="flex items-center space-x-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending Link...' : 'Sign in with Email'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const verifyRequest = searchParams.get('verifyRequest');

  if (verifyRequest) {
    return <VerifyRequest />;
  }

  return <SignInForm />;
}


export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginPageContent />
        </Suspense>
      </div>
    </div>
  );
}
