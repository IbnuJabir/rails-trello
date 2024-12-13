import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import bg1 from "@/assets/bg1.jpg";
import bg2 from "@/assets/bg2.jpg";
import bg3 from "@/assets/bg3.jpg";
import bg4 from "@/assets/bg4.jpg";
import bg5 from "@/assets/bg5.jpg";
import bg6 from "@/assets/bg6.jpg";
import Image from "next/image";

const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6];
export function CreateBoard() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Plus className="bg-green-800 rounded-sm p-1 size-8 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Start seemlesly Managing your project
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label
            htmlFor="bgImage"
            className="text-right my-4 py-6 text-gray-500"
          >
            Select Background
          </Label>
          <div className="grid grid-cols-3 gap-4">
            {backgrounds.map((bg, idx) => (
              <Image
                key={idx}
                src={bg}
                alt="background"
                width={80}
                height={80}
                className="rounded-md clickable"
                onClick={() => console.log(`${bg.src} clicked`)}
              />
            ))}
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Board Title
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="visibility" className="text-right">
              Visibility
            </Label>
            <Select name="visibility">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Visibility</SelectLabel>
                  <SelectItem value="apple">Private</SelectItem>
                  <SelectItem value="banana">Public</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
