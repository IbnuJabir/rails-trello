import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock components from shadcn library
jest.mock("@/components/ui/background-beams-with-collision", () => ({
  BackgroundBeamsWithCollision: ({ children }) => <div>{children}</div>,
}));

jest.mock("@/components/ui/vortex", () => ({
  Vortex: ({ children }) => <div>{children}</div>,
}));

// Mock useSession from next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("framer-motion", () => ({
  ...jest.requireActual("framer-motion"),
  useInView: () => [false, () => {}], // Mocked state and ref setter
}));

// useSession.mockReturnValue({ data: null, status: "unauthenticated" });
describe("Home Component", () => {
  it("renders correctly for unauthenticated users", () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Home />);

    // Check if the heading is rendered
    expect(
      screen.getByRole("heading", { name: /Rails Trello \./i }) // Match "Rails Trello ." with regex
    ).toBeInTheDocument();

    // Check if FlipWords text is rendered
    // expect(
    //   screen.getByText(/empower your organized workflow with our boards/i)
    // ).toBeInTheDocument();

    // Check if "Get Started" button is rendered and links to the login page
    const getStartedButton = screen.getByRole("link", { name: /get started/i });
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton).toHaveAttribute("href", "/login");
  });

  it("renders correctly for authenticated users", () => {
    useSession.mockReturnValue({
      data: { user: { name: "John Doe", email: "john.doe@example.com" } },
      status: "authenticated",
    });

    render(<Home />);

    // Check if the heading is rendered
    expect(
      screen.getByRole("heading", { name: /Rails Trello \./i }) // Match "Rails Trello ." with regex
    ).toBeInTheDocument();

    // // Check if FlipWords text is rendered
    // expect(
    //   screen.getByText(/empower your organized workflow with our boards/i)
    // ).toBeInTheDocument();

    // Check if "Go to Boards" button is rendered and links to the boards page
    const goToBoardsButton = screen.getByRole("link", {
      name: /go to boards/i,
    });
    expect(goToBoardsButton).toBeInTheDocument();
    expect(goToBoardsButton).toHaveAttribute("href", "/boards");
  });
});
