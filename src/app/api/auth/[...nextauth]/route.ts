import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import type { User as PrismaUser } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // The user object here is the one from the database.
      const dbUser = user as PrismaUser;
      session.user.id = dbUser.id;
      session.user.role = dbUser.role; // Add role to session
      return session;
    },
  },
  pages: {
    signIn: '/login',
    verifyRequest: '/login?verifyRequest=true', // Custom page for showing "Check your email" message
  },
  session: {
    strategy: 'database',
  },
};

const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
