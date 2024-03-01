import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";

const authOptions = {
  providers: [
    GithubProvider({
      clientId: "Iv1.0833d87e9b8ee02b",
      clientSecret: "750bf9746810e40ee22d9989861080fce9ceddb7",
    }),
  ],

  callbacks: {
    async session({ session, token, user }) {
      session.user.username = session?.user?.name
        .split(" ")
        .join("")
        .toLocaleLowerCase();

      session.user.uid = token.sub;
      return session;
    },
  },
  secret: "default_secret-key",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
