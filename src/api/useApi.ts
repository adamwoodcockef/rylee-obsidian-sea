import { useCallback, useEffect, useState } from "react";
import { API_APPLICATIONS } from "./constants";
import { ApiState, Application } from "./interfaces";

export const useApi = () => {
  const [state, setState] = useState<ApiState>({
    applications: [],
    isLoading: false,
    error: null,
    hasMore: true,
    totalCount: null,
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const fetchApplications = useCallback(
    async (pageNum: number, append: boolean = false) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(
          `${API_APPLICATIONS}?_page=${pageNum}&_limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newApplications: Application[] = await response.json();
        const totalCount = Number(response.headers.get("X-Total-Count"));

        setState((prev) => ({
          ...prev,
          applications: append
            ? [...prev.applications, ...newApplications]
            : newApplications,
          isLoading: false,
          totalCount,
          hasMore: pageNum * limit < totalCount,
        }));

        return newApplications;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [limit]
  );

  const fetchNextPage = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);

    try {
      await fetchApplications(nextPage, true);
    } catch (error) {
      // Error is already handled in fetchApplications
      console.error("Failed to fetch next page:", error);
    }
  }, [page, state.isLoading, state.hasMore, fetchApplications]);

  const resetAndFetch = useCallback(async () => {
    setPage(1);
    setState((prev) => ({
      ...prev,
      applications: [],
      hasMore: true,
      totalCount: null,
    }));
    await fetchApplications(1, false);
  }, [fetchApplications]);

  useEffect(() => {
    resetAndFetch();
  }, []);

  return {
    applications: state.applications,
    isLoading: state.isLoading,
    error: state.error,
    hasMore: state.hasMore,
    totalCount: state.totalCount,
    fetchNextPage,
    resetAndFetch,
    refetch: () => fetchApplications(page, false),
  };
};
