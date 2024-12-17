import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BoardComponent from "../src/app/boards/page";

// Mock the trpc hook
jest.mock("@/server/trpc", () => ({
  trpc: {
    board: {
      getAll: {
        useQuery: jest.fn(() => ({
          data: [
            { id: "1", title: "Board 1" },
            { id: "2", title: "Board 2" },
          ],
          isLoading: false,
        })),
      },
      create: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
        })),
      },
    },
  },
}));

describe("BoardComponent", () => {
  it("renders correctly", () => {
    render(<BoardComponent />);
    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();

    // expect(screen.getByText('Board 1')).toBeInTheDocument();
    // expect(screen.getByText('Board 2')).toBeInTheDocument();
    // expect(screen.getByText('Create new board')).toBeInTheDocument();
  });

  it("opens create board dialog", () => {
    render(<BoardComponent />);
    fireEvent.click(screen.getByText("Create new board"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Board Title")).toBeInTheDocument();
  });
});
