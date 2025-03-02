import { type DefaultSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from './axios';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    token?: string;
    user: {
      id: string;
      email: string;
      name: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    token: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await api.post('/auth/login', {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = response.data;

          if (user) {
            return {
              id: user._id,
              email: user.email,
              name: user.name,
              token: user.token,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        };
        session.token = token.token as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  debug: process.env.NODE_ENV === 'development',
}; 