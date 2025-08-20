import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Applications from "./Applications";
import { useApi } from "../../api/useApi";
import { vi } from "vitest";

// Mock the useApi hook
vi.mock("../../api/useApi");
const mockUseApi = useApi as any;

// Mock data
const mockApplications = [
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
];

describe("Applications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading state initially", () => {
    mockUseApi.mockReturnValue({
      applications: [],
      isLoading: true,
      error: null,
      hasMore: true,
      totalCount: null,
      fetchNextPage: vi.fn(),
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);
    expect(screen.getByText("Loading applications...")).toBeInTheDocument();
  });

  test("renders error state when API fails", () => {
    mockUseApi.mockReturnValue({
      applications: [],
      isLoading: false,
      error: "Failed to fetch applications",
      hasMore: true,
      totalCount: null,
      fetchNextPage: vi.fn(),
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);
    expect(
      screen.getByText("Error: Failed to fetch applications")
    ).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  test("renders empty state when no applications", () => {
    mockUseApi.mockReturnValue({
      applications: [],
      isLoading: false,
      error: null,
      hasMore: false,
      totalCount: 0,
      fetchNextPage: vi.fn(),
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);
    expect(screen.getByText("No applications found.")).toBeInTheDocument();
  });

  test("renders applications list when data is available", () => {
    mockUseApi.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: true,
      totalCount: 10,
      fetchNextPage: vi.fn(),
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);

    expect(screen.getByText("Test Company Ltd")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("£50,000")).toBeInTheDocument();
    expect(screen.getByText("14-06-2021")).toBeInTheDocument();
    expect(screen.getByText("09-04-2024")).toBeInTheDocument();
  });

  test("shows load more button when there are more pages", () => {
    mockUseApi.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: true,
      totalCount: 10,
      fetchNextPage: vi.fn(),
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);
    expect(screen.getByText("Load More")).toBeInTheDocument();
  });

  test("shows pagination info when total count is available", () => {
    mockUseApi.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: true,
      totalCount: 10,
      fetchNextPage: vi.fn(),
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);
    expect(
      screen.getByText("Showing 1 of 10 applications")
    ).toBeInTheDocument();
  });

  test("calls fetchNextPage when load more button is clicked", () => {
    const mockFetchNextPage = vi.fn();
    mockUseApi.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: true,
      totalCount: 10,
      fetchNextPage: mockFetchNextPage,
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);

    const loadMoreButton = screen.getByText("Load More");
    fireEvent.click(loadMoreButton);

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  test("disables load more button when loading", () => {
    mockUseApi.mockReturnValue({
      applications: mockApplications,
      isLoading: true,
      error: null,
      hasMore: true,
      totalCount: 10,
      fetchNextPage: vi.fn(),
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);

    const loadMoreButton = screen.getByText("Loading...");
    expect(loadMoreButton).toBeDisabled();
  });

  test("shows loading text on load more button when fetching next page", () => {
    mockUseApi.mockReturnValue({
      applications: mockApplications,
      isLoading: true,
      error: null,
      hasMore: true,
      totalCount: 10,
      fetchNextPage: vi.fn(),
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("hides load more button when no more pages", () => {
    mockUseApi.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: false,
      totalCount: 1,
      fetchNextPage: vi.fn(),
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);
    expect(screen.queryByText("Load More")).not.toBeInTheDocument();
  });

  test("calls retry function when retry button is clicked", () => {
    const mockRetry = vi.fn();

    // Mock window.location.reload
    Object.defineProperty(window, "location", {
      value: { reload: mockRetry },
      writable: true,
    });

    mockUseApi.mockReturnValue({
      applications: [],
      isLoading: false,
      error: "API Error",
      hasMore: true,
      totalCount: null,
      fetchNextPage: vi.fn(),
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);

    const retryButton = screen.getByText("Retry");
    fireEvent.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  test("renders multiple applications correctly", () => {
    const multipleApplications = [
      ...mockApplications,
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

    mockUseApi.mockReturnValue({
      applications: multipleApplications,
      isLoading: false,
      error: null,
      hasMore: true,
      totalCount: 20,
      fetchNextPage: vi.fn(),
      resetAndFetch: vi.fn(),
      refetch: vi.fn(),
    });

    render(<Applications />);

    expect(screen.getByText("Test Company Ltd")).toBeInTheDocument();
    expect(screen.getByText("Another Company")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(
      screen.getByText("Showing 2 of 20 applications")
    ).toBeInTheDocument();
  });
});
