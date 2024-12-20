import { render, screen } from "@testing-library/react";
import { trpc } from "@/server/client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Boards from "@/app/boards/page";

// Mock the required modules
jest.mock("@/server/client", () => ({
  trpc: {
    board: {
      getBoards: {
        useQuery: jest.fn(),
      },
    },
  },
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

jest.mock("@/components/boardComponent/add-board", () => ({
  CreateBoard: () => (
    <div data-testid="create-board">Create Board Component</div>
  ),
}));

jest.mock("@/app/loading", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-page">Loading...</div>,
}));

describe("Boards Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show loading state", () => {
    // Mock loading state
    (trpc.board.getBoards.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: undefined,
      error: null,
    });

    (useSession as jest.Mock).mockReturnValue({
      status: "loading",
      data: null,
    });

    render(<Boards />);
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  it("should redirect to login if no session", () => {
    // Mock no session state
    (trpc.board.getBoards.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [],
      error: null,
    });

    (useSession as jest.Mock).mockReturnValue({
      status: "unauthenticated",
      data: null,
    });

    render(<Boards />);
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("should show empty state with create board option", () => {
    // Mock authenticated session with no boards
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: { user: { id: "1", name: "Test User" } },
    });

    (trpc.board.getBoards.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [],
      error: null,
    });

    render(<Boards />);
    expect(screen.getByTestId("create-board")).toBeInTheDocument();
    expect(screen.getByAltText("background")).toBeInTheDocument();
  });

  it("should display error message when query fails", () => {
    // Mock error state
    const errorMessage = "Failed to fetch boards";
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: { user: { id: "1", name: "Test User" } },
    });

    (trpc.board.getBoards.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      error: { shape: { message: errorMessage } },
    });

    render(<Boards />);
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it("should display list of boards when data is available", () => {
    // Mock successful data fetch
    const mockBoards = [
      { id: "1", name: "Board 1", bgImage: "/bg1.jpg" },
      { id: "2", name: "Board 2", bgImage: "/bg2.jpg" },
      { id: "3", name: "Board 3", bgImage: "/bg3.jpg" },
    ];

    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: { user: { id: "1", name: "Test User" } },
    });

    (trpc.board.getBoards.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockBoards,
      error: null,
    });

    render(<Boards />);

    // Check if heading exists
    expect(screen.getByText("Boards")).toBeInTheDocument();

    // Check if all boards are rendered
    mockBoards.forEach((board) => {
      expect(screen.getByText(board.name)).toBeInTheDocument();
    });

    // Check if board links are created correctly
    const boardLinks = screen.getAllByRole("link");
    expect(boardLinks).toHaveLength(mockBoards.length);
    boardLinks.forEach((link, index) => {
      expect(link).toHaveAttribute("href", `/boards/${mockBoards[index].id}`);
    });

    // Verify images are rendered with correct fallback
    const boardImages = screen.getAllByAltText("board background");
    boardImages.forEach((image, index) => {
      expect(image).toHaveAttribute(
        "src",
        mockBoards[index].bgImage || "/bg1.jpg"
      );
    });
  });
});
