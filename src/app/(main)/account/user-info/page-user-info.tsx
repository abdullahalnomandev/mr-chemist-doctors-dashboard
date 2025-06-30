"use client";

import { QK } from "@/lib/query-keys";
import { serverApiRequest } from "@/lib/utils-server";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export type TUser = {
  _id: string;
  id: string;
  name?: string;
  email: string;
  password?: string;
  needsPasswordChange?: boolean;
  role: string;
  status: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
};

export default function UserInfoPage() {
  // Fetch user profile data
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<TUser>({
    queryKey: [QK.USER],
    queryFn: () => serverApiRequest("GET", "/users/me"),
    select: (data: any) => data.data,
  });

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !profile) {
    // Added check for !profile
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-red-500">
          Error loading profile data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg bg-white p-4 shadow-xs">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-medium">User Information</h1>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-500">ID</h3>
            <p className="text-gray-900">{profile.id}</p>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-500">Name</h3>
            <p className="text-gray-900">{profile.name}</p>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-500">Email</h3>
            <p className="text-gray-900">{profile.email}</p>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-500">Role</h3>
            <p className="text-gray-900">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
