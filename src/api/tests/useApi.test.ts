import { renderHook, act, waitFor } from "@testing-library/react";
import { useApi } from "../useApi";
import { Application } from "../interfaces";
import { vi } from "vitest";

// Mock fetch globally
global.fetch = vi.fn();

// Mock data
const mockApplications: Application[] = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    loan_amount: 50000,
    loan_type: "Business Loan",
    email: "john.doe@example.com",
    company: "Test Company Ltd",
    date_created: "2021-06-14T04:13:41.155Z",
    expiry_date: "2024-04-09T17:22:31.066Z",
    avatar: "https://example.com/avatar.jpg",
    loan_history: [],
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    loan_amount: 75000,
    loan_type: "CBILS",
    email: "jane.smith@example.com",
    company: "Another Company",
    date_created: "2021-08-20T10:30:00.000Z",
    expiry_date: "2024-06-15T12:00:00.000Z",
    avatar: "https://example.com/avatar2.jpg",
    loan_history: [],
  },
];

describe("useApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    (global.fetch as any).mockClear();
  });

  test("fetches applications on mount", async () => {
    const mockResponse = {
      ok: true,
      json: async () => mockApplications,
      headers: new Map([["X-Total-Count", "10"]]),
    };

    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useApi());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.applications).toEqual(mockApplications);
    expect(result.current.totalCount).toBe(10);
    expect(result.current.hasMore).toBe(true);
  });

  test("prevents fetching when no more pages", async () => {
    const mockResponse = {
      ok: true,
      json: async () => mockApplications,
      headers: new Map([["X-Total-Count", "2"]]),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useApi());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have no more pages
    expect(result.current.hasMore).toBe(false);

    // Try to fetch next page
    act(() => {
      result.current.fetchNextPage();
    });

    // Should not make additional API calls
    expect(global.fetch).toHaveBeenCalledTimes(1); // Only initial call
  });

  test("resets and fetches correctly", async () => {
    const mockResponse = {
      ok: true,
      json: async () => mockApplications,
      headers: new Map([["X-Total-Count", "10"]]),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useApi());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Reset and fetch
    act(() => {
      result.current.resetAndFetch();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.applications).toEqual(mockApplications);
    expect(result.current.hasMore).toBe(true);
  });

  test("refetches current page correctly", async () => {
    const mockResponse = {
      ok: true,
      json: async () => mockApplications,
      headers: new Map([["X-Total-Count", "10"]]),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useApi());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Refetch current page
    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.applications).toEqual(mockApplications);
  });
});
