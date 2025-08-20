import { render, screen } from "@testing-library/react";
import SingleApplication from "./SingleApplication";
import { Application } from "../../api/interfaces";

// Mock data for testing
const mockApplication: Application = {
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
};

describe("SingleApplication", () => {
  test("renders application information correctly", () => {
    render(<SingleApplication application={mockApplication} />);

    // Check if all labels are present
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Loan Amount")).toBeInTheDocument();
    expect(screen.getByText("Application Date")).toBeInTheDocument();
    expect(screen.getByText("Expiry date")).toBeInTheDocument();
  });

  test("displays company name correctly", () => {
    render(<SingleApplication application={mockApplication} />);
    expect(screen.getByText("Test Company Ltd")).toBeInTheDocument();
  });

  test("displays full name correctly", () => {
    render(<SingleApplication application={mockApplication} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  test("displays email as clickable mailto link", () => {
    render(<SingleApplication application={mockApplication} />);
    const emailLink = screen.getByText("john.doe@example.com");
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest("a")).toHaveAttribute(
      "href",
      "mailto:john.doe@example.com"
    );
  });

  test("formats loan amount as GBP currency", () => {
    render(<SingleApplication application={mockApplication} />);
    expect(screen.getByText("£50,000")).toBeInTheDocument();
  });

  test("formats application date with dash separators", () => {
    render(<SingleApplication application={mockApplication} />);
    // 2021-06-14 should become 14-06-2021
    expect(screen.getByText("14-06-2021")).toBeInTheDocument();
  });

  test("formats expiry date with dash separators", () => {
    render(<SingleApplication application={mockApplication} />);
    // 2024-04-09 should become 09-04-2024
    expect(screen.getByText("09-04-2024")).toBeInTheDocument();
  });

  test("handles different loan amounts correctly", () => {
    const largeAmountApp = { ...mockApplication, loan_amount: 1234567 };
    render(<SingleApplication application={largeAmountApp} />);
    expect(screen.getByText("£1,234,567")).toBeInTheDocument();
  });

  test("handles different date formats correctly", () => {
    const differentDateApp = {
      ...mockApplication,
      date_created: "2023-12-01T00:00:00.000Z",
      expiry_date: "2025-01-15T00:00:00.000Z",
    };
    render(<SingleApplication application={differentDateApp} />);
    expect(screen.getByText("01-12-2023")).toBeInTheDocument();
    expect(screen.getByText("15-01-2025")).toBeInTheDocument();
  });

  test("renders with proper CSS classes", () => {
    const { container } = render(
      <SingleApplication application={mockApplication} />
    );

    // Check for the main container class (CSS Modules will hash the name)
    const mainElement = container.firstChild as HTMLElement;
    expect(mainElement.className).toContain("SingleApplication");

    // Check for cell classes
    const cells = container.querySelectorAll("[class*='cell']");
    expect(cells).toHaveLength(6); // 6 data fields
  });
});
