import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { CreateBoard } from "@/components/boardComponent/add-board";
import { trpc } from "@/server/client";
import { useRouter } from "next/navigation";

jest.mock("@/server/client", () => ({
  trpc: {
    board: {
      createBoard: {
        useMutation: jest.fn(),
      },
    },
    useUtils: jest.fn(() => ({
      board: { getBoards: { invalidate: jest.fn() } },
    })),
  },
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    const imgSrc = typeof src === "object" ? src.src : src;
    return <img {...props} src={imgSrc} alt={alt} />;
  },
}));

describe("CreateBoard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it("should create a new board and display a success message", async () => {
    const mockInvalidate = jest.fn();
    const mockMutate = jest.fn().mockImplementation((data) => {
      // Simulate successful mutation
      setTimeout(() => {
        (
          trpc.board.createBoard.useMutation as jest.Mock
        ).mock.calls[0][0].onSuccess();
      }, 0);
    });

    (trpc.board.createBoard.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    (trpc.useUtils as jest.Mock).mockReturnValue({
      board: { getBoards: { invalidate: mockInvalidate } },
    });

    render(<CreateBoard />);

    // Open the dialog
    fireEvent.click(screen.getByText(/Create a New board/i));

    // Select an image
    const firstImage = screen.getAllByAltText("background")[0];
    fireEvent.click(firstImage);

    // Fill in the board name
    const input = screen.getByLabelText(/Board Title/i);
    fireEvent.change(input, { target: { value: "Test Board" } });

    // Click create button
    const createButton = screen.getByRole("button", { name: /Create/i });
    fireEvent.click(createButton);

    // Wait for mutation and success toast
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: "Test Board",
        bgImage: firstImage.getAttribute("src"),
        isPrivate: true,
      });
      expect(toast.success).toHaveBeenCalledWith("Board created successfully!");
      expect(mockInvalidate).toHaveBeenCalled();
    });
  });

  it("should display error if background image is not selected", async () => {
    const mockMutate = jest.fn();

    (trpc.board.createBoard.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<CreateBoard />);

    // Open the dialog
    fireEvent.click(screen.getByText(/Create a New board/i));

    // Fill in the board name but don't select an image
    const input = screen.getByLabelText(/Board Title/i);
    fireEvent.change(input, { target: { value: "Test Board" } });

    // Click create button
    const createButton = screen.getByRole("button", { name: /Create/i });
    fireEvent.click(createButton);

    // Check for error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Select Board background image");
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("should display error if board name is not provided", async () => {
    const mockMutate = jest.fn();

    (trpc.board.createBoard.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<CreateBoard />);

    // Open the dialog
    fireEvent.click(screen.getByText(/Create a New board/i));

    // Select an image but don't provide name
    const firstImage = screen.getAllByAltText("background")[0];
    fireEvent.click(firstImage);

    // Click create button
    const createButton = screen.getByRole("button", { name: /Create/i });
    fireEvent.click(createButton);

    // Check for error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Board name is required");
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("should handle mutation error", async () => {
    const mockMutate = jest.fn().mockImplementation((data) => {
      // Simulate failed mutation
      setTimeout(() => {
        (
          trpc.board.createBoard.useMutation as jest.Mock
        ).mock.calls[0][0].onError(new Error("Test error"));
      }, 0);
    });

    (trpc.board.createBoard.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<CreateBoard />);

    // Open the dialog
    fireEvent.click(screen.getByText(/Create a New board/i));

    // Select an image
    const firstImage = screen.getAllByAltText("background")[0];
    fireEvent.click(firstImage);

    // Fill in the board name
    const input = screen.getByLabelText(/Board Title/i);
    fireEvent.change(input, { target: { value: "Test Board" } });

    // Click create button
    const createButton = screen.getByRole("button", { name: /Create/i });
    fireEvent.click(createButton);

    // Check for error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred");
    });
  });
});
