import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import api, { apiEndpoints } from "@/lib/axios"
import type { JWT } from "next-auth/jwt"
import type { Session, User as NextAuthUser } from "next-auth"

interface User extends NextAuthUser {
  firstName: string;
  lastName: string;
  role: string;
  token: string;
  accessToken: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Invalid credentials');
          }

          const { user, token } = data;

          if (user && token) {
            return {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              token,
              accessToken: token,
              name: `${user.firstName} ${user.lastName}`,
            } as User;
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as User;
        token.id = u.id!;
        token.email = u.email!;
        token.firstName = u.firstName;
        token.lastName = u.lastName;
        token.role = u.role;
        token.token = u.token;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          firstName: token.firstName,
          lastName: token.lastName,
          role: token.role,
        },
        token: token.token,
      };
    },
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
}); 