import { createSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
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
          <CardContent>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Sign in to continue. For demo purposes, please select a role to
              simulate login.
            </p>
            <form className="grid gap-3">
              <Button
                size="lg"
                formAction={async () => {
                  'use server';
                  await createSession('Student');
                }}
              >
                Login as Student
              </Button>
              <Button
                size="lg"
                variant="secondary"
                formAction={async () => {
                  'use server';
                  await createSession('Club Leader');
                }}
              >
                Login as Club Leader
              </Button>
              <Button
                size="lg"
                variant="secondary"
                formAction={async () => {
                  'use server';
                  await createSession('Faculty');
                }}
              >
                Login as Faculty
              </Button>
              <Button
                size="lg"
                variant="outline"
                formAction={async () => {
                  'use server';
                  await createSession('Admin');
                }}
              >
                Login as Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
