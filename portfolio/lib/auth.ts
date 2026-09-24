import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.password) return null;

        await dbConnect();

        // 1. Admin login via username
        if (credentials.username) {
          const admin = await Admin.findOne({ username: credentials.username });
          if (!admin) return null;
          const isValid = await bcrypt.compare(credentials.password, admin.password);
          if (!isValid) return null;
          return { id: admin._id.toString(), name: admin.username, email: '', role: 'admin' };
        }

        // 2. User login via email
        if (credentials.email) {
          if (credentials.email !== 'malindi.wpm@gmail.com' && credentials.email !== 'nchathuranga533@gmail.com') {
            throw new Error('Access denied: Unauthorized email address.');
          }

          const user = await User.findOne({ email: credentials.email });
          if (!user) return null;
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;
          return { id: user._id.toString(), name: user.name, email: user.email, role: 'user' };
        }

        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
