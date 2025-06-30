"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios, { AxiosError } from "axios";
import { getServerSession } from "next-auth";

export async function serverApiRequest(
  method: string,
  path: string,
  config?: {
    params?: Record<string, string | number | boolean | unknown>;
    headers?: Record<string, string>;
    data?: unknown;
  }
) {
  const session = await getServerSession(authOptions);

  const baseURL = process.env.API_BASE_URL;

  const headers = {
    "Content-Type": "application/json",
    ...(session?.accessToken && {
      Authorization: session.accessToken,
    }),
    ...config?.headers,
  };

  try {
    const response = await axios({
      method,
      url: path,
      baseURL,
      headers,
      params: config?.params,
      data: config?.data,
    });

    return response.data;
  } catch (error) {
    console.log("Error making API request:", error);
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw error;
  }
}
