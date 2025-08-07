'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type UserRole = 'Student' | 'Club Leader' | 'Faculty' | 'Admin';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0].substring(0, 2);
};

const users: Record<UserRole, User> = {
  Student: { name: 'Alex Johnson', email: 'alex.j@example.edu', role: 'Student' },
  'Club Leader': { name: 'Ben Carter', email: 'ben.c@example.edu', role: 'Club Leader' },
  Faculty: { name: 'Dr. Evelyn Reed', email: 'evelyn.r@example.edu', role: 'Faculty' },
  Admin: { name: 'Charlie Davis', email: 'charlie.d@example.edu', role: 'Admin' },
};

export async function createSession(role: UserRole) {
  const user = users[role];
  if (!user) {
    throw new Error('Invalid role');
  }
  const sessionData = JSON.stringify(user);
  cookies().set('session', sessionData, { httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production' });
  redirect('/dashboard');
}

export async function getSession(): Promise<User | null> {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie) {
    return null;
  }
  try {
    const user: User = JSON.parse(sessionCookie.value);
    return user;
  } catch (error) {
    console.error('Failed to parse session cookie:', error);
    return null;
  }
}

export async function deleteSession() {
  cookies().delete('session');
  redirect('/login');
}
