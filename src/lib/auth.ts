import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { UserRole } from "@/lib/constants/roles";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          // Create new user with default USER role
          user = await prisma.user.create({
            data: {
              email: credentials.email as string,
              name: credentials.email?.toString().split("@")[0],
              role: UserRole.USER,
              isPro: false,
              emailQuota: 10,
              emailsUsed: 0,
              quotaResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || UserRole.USER;
        token.isPro = (user as any).isPro || false;
        token.emailQuota = (user as any).emailQuota || 10;
        token.emailsUsed = (user as any).emailsUsed || 0;
        token.proExpiresAt = (user as any).proExpiresAt || null;
      }

      // Session update (e.g., after upgrade)
      if (trigger === "update" && session) {
        // Fetch fresh user data from database
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });

        if (freshUser) {
          token.role = freshUser.role;
          token.isPro = freshUser.isPro;
          token.emailQuota = freshUser.emailQuota;
          token.emailsUsed = freshUser.emailsUsed;
          token.proExpiresAt = freshUser.proExpiresAt;
        }
      }

      // Check if PRO expired
      if (
        token.proExpiresAt &&
        new Date(token.proExpiresAt as string) < new Date()
      ) {
        // Downgrade to USER
        token.role = UserRole.USER;
        token.isPro = false;

        // Update database
        await prisma.user.update({
          where: { id: token.id as string },
          data: {
            role: UserRole.USER,
            isPro: false,
          },
        });
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.isPro = token.isPro as boolean;
        session.user.emailQuota = token.emailQuota as number;
        session.user.emailsUsed = token.emailsUsed as number;
        session.user.proExpiresAt = token.proExpiresAt as Date | null;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});
