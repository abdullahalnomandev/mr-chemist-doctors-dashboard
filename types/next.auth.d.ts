import "next-auth";

// Extend the built-in session types
declare module "next-auth" {
  interface User {
    _id: string;
    id: string;
    role: string;
    accessToken: string;
    needsPasswordChange: boolean;
  }
  interface Session {
    user: {
      _id: string;
      id: string;
      role: string;
      needsPasswordChange: boolean;
    };
    accessToken: string;
    error?: string;
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    id: string;
    role: string;
    accessToken: string;
    needsPasswordChange: boolean;
    error?: string;
  }
}
