import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email e senha são obrigatórios");
          }

          // TODO: Replace with actual database lookup using Prisma
          // For now, using a demo user
          const demoUser = {
            id: "1",
            email: "admin@construcao.com",
            password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS", // "admin123"
            name: "Administrador",
            companyId: 1
          };

          if (credentials.email === demoUser.email) {
            const isValidPassword = await bcrypt.compare(credentials.password, demoUser.password);
            
            if (isValidPassword) {
              return {
                id: demoUser.id,
                email: demoUser.email,
                name: demoUser.name,
                companyId: demoUser.companyId
              };
            }
          }

          throw new Error("Credenciais inválidas");
        } catch (error) {
          console.error("Erro na autenticação:", error);
          throw new Error("Erro interno do servidor");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.companyId = user.companyId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || "";
        session.user.companyId = token.companyId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
