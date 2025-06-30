/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { Session, User } from "next-auth";
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Define the API response type
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    needsPasswordChange: boolean;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Make API request to your authentication endpoint
          const response = await axios.post<LoginResponse>(
            `${process.env.API_BASE_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              withCredentials: true, // Important to receive and store cookies
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          // Check if login was successful and we have an access token
          if (response.data.success && response.data.data.accessToken) {
            const accessToken = response.data.data.accessToken;
            const needsPasswordChange = response.data.data.needsPasswordChange;

            // Extract user ID and role from the token
            const tokenParts = accessToken.split(".");
            if (tokenParts.length !== 3) {
              throw new Error("Invalid token format");
            }

            const payload = JSON.parse(
              Buffer.from(tokenParts[1], "base64").toString()
            );

            // Return the basic user data and tokens
            return {
              _id: payload._id,
              id: payload.userId,
              role: payload.role,
              accessToken,
              needsPasswordChange,
            };
          } else {
            throw new Error(response.data.message || "Authentication failed");
          }
        } catch (error: any) {
          console.error("Authentication error:", error);

          // Handle different types of errors
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorMessage =
              error.response.data?.message ||
              `Authentication failed: ${error.response.status}`;

            // Map specific error messages to more user-friendly ones
            if (errorMessage.includes("not found")) {
              throw new Error("User not found");
            } else if (errorMessage.includes("deleted")) {
              throw new Error("This account has been deleted");
            } else if (errorMessage.includes("blocked")) {
              throw new Error("This account has been blocked");
            } else if (errorMessage.includes("Password")) {
              throw new Error("Incorrect password");
            } else {
              throw new Error(errorMessage);
            }
          } else if (error.request) {
            // The request was made but no response was received
            throw new Error("No response from authentication server");
          } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(error.message || "Authentication error");
          }
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          _id: user._id,
          id: user.id,
          role: user.role,
          needsPasswordChange: user.needsPasswordChange,
        };
      }

      // Return previous token if the access token has not expired yet
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      // Add user data from token to the session
      if (token) {
        session.user = {
          _id: token._id as string,
          id: token.id as string,
          role: token.role as string,
          needsPasswordChange: token.needsPasswordChange as boolean,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

