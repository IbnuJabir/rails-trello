import React, { forwardRef, useState } from "react";
import classNames from "classnames";
import { Edit2, Check, X, Trash2 } from "lucide-react";
import { Handle, Remove } from "../Item";
import styles from "./Container.module.scss";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/server/client";
import Loader from "../loader";
import { toast } from "react-toastify";

export interface Props {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  listId?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  boardId: string;
  onClick?(): void;
  onRemove?(): void;
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      listId,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      boardId,
      ...props
    }: Props,
    ref
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedLabel, setEditedLabel] = useState(label || "");
    const utils = trpc.useUtils();

    const updateList = trpc.list.update.useMutation({
      onSuccess: () => {
        utils.list.getAll.invalidate({ boardId });
        utils.board.getBoard.invalidate({ id: boardId });
        toast.success("List updated successfully");
      },
      onError: (error) => {
        console.error("Error updating list:", error);
        toast.error("Failed to update list. Please try again.");
      },
    });

    const deleteList = trpc.list.remove.useMutation({
      onSuccess: () => {
        utils.list.getAll.invalidate({ boardId });
        utils.board.getBoard.invalidate({ boardId });
        toast.success("List deleted successfully");
      },
      onError: (error) => {
        console.error("Error deleting list:", error);
        toast.error("Failed to delete list. Please try again.");
      },
    });

    const handleEditClick = () => {
      setIsEditing(true);
      setEditedLabel(label || "");
    };

    const handleSaveClick = async () => {
      if (editedLabel.trim() !== "" && listId) {
        try {
          await updateList.mutateAsync({
            id: listId,
            name: editedLabel,
          });
          setIsEditing(false);
        } catch (error) {
          console.error("Error in handleSaveClick:", error);
        }
      } else {
        toast.error("List name cannot be empty");
      }
    };

    const handleCancelClick = () => {
      setIsEditing(false);
      setEditedLabel(label || "");
    };

    const handleDeleteClick = async () => {
      if (listId) {
        if (window.confirm("Are you sure you want to delete this list?")) {
          try {
            deleteList.mutate({ id: listId });
          } catch (error) {
            console.error("Error in handleDeleteClick:", error);
          }
        }
      }
    };

    const Component = onClick ? "button" : "div";

    return (
      <Component
        {...props}
        ref={ref}
        style={
          {
            ...style,
            "--columns": columns,
          } as React.CSSProperties
        }
        className={classNames(
          styles.Container,
          unstyled && styles.unstyled,
          horizontal && styles.horizontal,
          hover && styles.hover,
          placeholder && styles.placeholder,
          scrollable && styles.scrollable,
          shadow && styles.shadow
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label ? (
          <div className={styles.Header}>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedLabel}
                  onChange={(e) => setEditedLabel(e.target.value)}
                  className="flex-1"
                />
                <Button
                  disabled={updateList.isPending}
                  onClick={handleSaveClick}
                  size="sm"
                  variant="ghost"
                >
                  {updateList.isPending ? (
                    <Loader height={17} />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </Button>
                <Button onClick={handleCancelClick} size="sm" variant="ghost">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span>{label}</span>
                <div className="flex items-center gap-2">
                  <Edit2
                    className="w-4 h-4 rounded-sm hover:bg-accent/50 transition-colors duration-300 cursor-pointer"
                    onClick={handleEditClick}
                  />
                  <Trash2
                    className="w-4 h-4 rounded-sm hover:bg-accent/50 transition-colors duration-300 cursor-pointer"
                    onClick={handleDeleteClick}
                  />
                </div>
              </div>
            )}
            <div className={styles.Actions}>
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              <Handle {...handleProps} />
            </div>
          </div>
        ) : null}
        {placeholder ? children : <ul>{children}</ul>}
      </Component>
    );
  }
);

Container.displayName = "Container";
