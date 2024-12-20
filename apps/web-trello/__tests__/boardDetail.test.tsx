import { render, screen } from "@testing-library/react";
import { trpc } from "@/server/client";
import { useSession } from "next-auth/react";
import { useParams, redirect } from "next/navigation";
import BoardDetail from "@/app/boards/[boardId]/page";

// Mock the dependencies
jest.mock("@/server/client", () => ({
  trpc: {
    board: {
      getBoard: {
        useQuery: jest.fn(),
      },
    },
  },
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  redirect: jest.fn(),
}));

// Mock loading page
jest.mock("@/app/loading", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-page">Loading...</div>,
}));

// Mock the default background image
jest.mock("@/assets/bg1.jpg", () => ({
  default: "/mock-default-bg.jpg",
  __esModule: true,
}));

jest.mock("@/components/boardComponent/boardNav", () => ({
  TrelloBoardBar: jest.fn().mockImplementation(({ boardTitle }) => (
    <div data-testid="board-bar">
      <h1>{boardTitle}</h1>
    </div>
  )),
}));

jest.mock("@/components/boardComponent/MultipleContainers", () => ({
  MultipleContainers: jest
    .fn()
    .mockImplementation(() => (
      <div data-testid="multiple-containers">Multiple Containers Component</div>
    )),
}));

describe("BoardDetail Page", () => {
  const mockBoardId = "board-123";
  const mockBoardData = {
    id: mockBoardId,
    name: "Test Board",
    bgImage: "/test-background.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ boardId: mockBoardId });
    process.env.NEXT_PUBLIC_TRPC_BASE_URL = "http://test.com";
  });

  it("should show loading state", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "loading" });
    (trpc.board.getBoard.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
    });

    render(<BoardDetail />);
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  it("should redirect to login if no session", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    (trpc.board.getBoard.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      error: null,
    });

    render(<BoardDetail />);
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("should display error message when query fails", () => {
    const errorMessage = "Failed to fetch board";
    (useSession as jest.Mock).mockReturnValue({
      data: { user: {} },
      status: "authenticated",
    });
    (trpc.board.getBoard.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      error: { message: errorMessage },
    });

    render(<BoardDetail />);
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it("should display board details when data is available", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: {} },
      status: "authenticated",
    });
    (trpc.board.getBoard.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockBoardData,
      error: null,
    });

    const { container } = render(<BoardDetail />);

    // Check if board title is rendered in TrelloBoardBar
    expect(screen.getByText(mockBoardData.name)).toBeInTheDocument();

    // Check if MultipleContainers component is rendered
    expect(screen.getByTestId("multiple-containers")).toBeInTheDocument();

    // Check if background image is set correctly
    const boardContainer = container.firstChild as HTMLElement;
    const expectedBgUrl = `url(http://test.com${mockBoardData.bgImage})`;
    expect(boardContainer).toHaveStyle(`background-image: ${expectedBgUrl}`);
  });

  it("should use default background image when bgImage is not provided", () => {
    const mockDataWithoutBg = {
      ...mockBoardData,
      bgImage: null,
    };

    (useSession as jest.Mock).mockReturnValue({
      data: { user: {} },
      status: "authenticated",
    });
    (trpc.board.getBoard.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockDataWithoutBg,
      error: null,
    });

    const { container } = render(<BoardDetail />);

    // Check if default background image is used
    const boardContainer = container.firstChild as HTMLElement;
    expect(boardContainer).toHaveStyle(
      `background-image: url(/mock-default-bg.jpg)`
    );
  });

  it("should pass correct props to child components", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: {} },
      status: "authenticated",
    });
    (trpc.board.getBoard.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockBoardData,
      error: null,
    });

    render(<BoardDetail />);

    // Check TrelloBoardBar props
    const boardBar = screen.getByTestId("board-bar");
    expect(boardBar).toHaveTextContent(mockBoardData.name);

    // Check if MultipleContainers is rendered
    expect(screen.getByTestId("multiple-containers")).toBeInTheDocument();
  });
});
