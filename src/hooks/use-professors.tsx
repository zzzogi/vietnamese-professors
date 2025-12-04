import { useQuery } from "@tanstack/react-query";

export interface Professor {
  id: string;
  name: string;
  email: string;
  university: string;
  department: string;
  major: string;
  location: string;
  bio: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessorsResponse {
  data: Professor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface UseProfessorsParams {
  search?: string;
  university?: string;
  major?: string;
  location?: string;
  page?: number;
  limit?: number;
}

/**
 * React Query hook để fetch danh sách professors
 * Tự động cache và refetch khi params thay đổi
 */
export function useProfessors(params: UseProfessorsParams = {}) {
  const {
    search = "",
    university = "",
    major = "",
    location = "",
    page = 1,
    limit = 10,
  } = params;

  return useQuery<ProfessorsResponse>({
    queryKey: [
      "professors",
      { search, university, major, location, page, limit },
    ],
    queryFn: async () => {
      // Build URL với query params
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (university) queryParams.set("university", university);
      if (major) queryParams.set("major", major);
      if (location) queryParams.set("location", location);
      queryParams.set("page", page.toString());
      queryParams.set("limit", limit.toString());

      const response = await fetch(`/api/professors?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch professors");
      }

      return response.json();
    },
    // Cache trong 5 phút
    staleTime: 5 * 60 * 1000,
  });
}
