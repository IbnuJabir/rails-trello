"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { trpc } from "@/server/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import bg1 from "@/assets/bg1.jpg";
import bg2 from "@/assets/bg2.jpg";
import bg3 from "@/assets/bg3.jpg";
import bg4 from "@/assets/bg4.jpg";
import bg5 from "@/assets/bg5.jpg";
import bg6 from "@/assets/bg6.jpg";
import Image from "next/image";
import Loader from "../loader";

const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6];

type Board = {
  name: string;
  bgImage: string | null;
  isPrivate: boolean;
};

export function CreateBoard() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [board, setBoard] = useState<Board>({
    name: "",
    bgImage: null,
    isPrivate: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog open/close

  const createBoard = trpc.board.createBoard.useMutation({
    onSuccess: (data) => {
      console.log(data);
      toast.success("Board created successfully!");
      setIsDialogOpen(false); // Close the dialog on success
    },
    onError: (error) => {
      console.log(error);
      toast.error("An unexpected error occurred");
    },
  });

  const handleImageSelect = (src: string) => {
    setSelectedImage(src);
    setBoard((prevBoard) => ({
      ...prevBoard,
      bgImage: src,
    }));
  };

  const CreateBoard = async () => {
    console.log("Creating board...");
    console.log(board);
    if (!board.bgImage) {
      toast.error("Select Board background image");
      return;
    }
    if (!board.name) {
      toast.error("Board name is required");
      return;
    }
    createBoard.mutate({
      name: board.name,
      bgImage: board.bgImage,
      isPrivate: board.isPrivate,
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2">
          <Plus className="bg-black text-white rounded-sm p-1 size-6 cursor-pointer" />
          Create a New board
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Start seamlessly managing your project
          </DialogDescription>
        </DialogHeader>
        <form>
          {/* Background Selection */}
          <div>
            <Label
              htmlFor="bgImage"
              className="text-right my-4 py-6 text-gray-500"
            >
              Select Background
            </Label>
            <div className="grid grid-cols-3 gap-4">
              {backgrounds?.map((bg, idx) => (
                <Image
                  key={idx}
                  src={bg}
                  alt="background"
                  width={80}
                  height={80}
                  className={`rounded-md clickable cursor-pointer ${
                    selectedImage === bg.src ? "border-2 border-green-500" : ""
                  }`}
                  onClick={() => handleImageSelect(bg.src)}
                />
              ))}
            </div>
          </div>

          {/* Board Title */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Board Title
              </Label>
              <Input
                id="name"
                className="col-span-3"
                onChange={(e) =>
                  setBoard((prevBoard) => ({
                    ...prevBoard,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            {/* Visibility Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="visibility" className="text-right">
                Visibility
              </Label>
              <Select
                name="visibility"
                onValueChange={(value) =>
                  setBoard((prevBoard) => ({
                    ...prevBoard,
                    isPrivate: value === "private",
                  }))
                }
              >
                <SelectTrigger className="w-[180px]" defaultValue={"private"}>
                  <SelectValue placeholder="private" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Visibility</SelectLabel>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <DialogFooter>
            <Button
              type="button"
              onClick={CreateBoard}
              disabled={createBoard.isPending}
            >
              {createBoard.isPending ? <Loader /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
