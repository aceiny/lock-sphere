"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/lib/api/categories";
import { Category } from "@/lib/types/api";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const { data: categories, isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [newCategory, setNewCategory] = React.useState("");
  const [error, setError] = React.useState("");
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    React.useState<Category | null>(null);

  // Reset form state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setNewCategory("");
      setError("");
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCategory = newCategory.trim();

    if (!trimmedCategory) {
      setError("Category name cannot be empty");
      return;
    }

    if (
      categories?.some(
        (cat) => cat.name.toLowerCase() === trimmedCategory.toLowerCase(),
      )
    ) {
      setError("Category already exists");
      return;
    }

    createCategory(trimmedCategory, {
      onError: (error) => {
        setError(error.message);
      },
      onSuccess: () => {
        setNewCategory("");
        setError("");
      },
    });
  };

  const handleDeleteCategory = (category: Category, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCategoryToDelete(category);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete && categoryToDelete.name !== "Other") {
      deleteCategory(categoryToDelete.id, {
        onError: (error) => {
          setError(error.message);
        },
        onSuccess: () => {
          handleDeleteCancel();
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add or remove password categories
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="category">New Category Name</Label>
                <Input
                  id="category"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    setError("");
                  }}
                  className={cn(error && "border-red-500")}
                  disabled={isCreating}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <div className="space-y-2">
                <Label>Current Categories</Label>
                <div className="flex flex-wrap gap-2 p-4 rounded-lg border bg-muted/50">
                  {isLoading ? (
                    <div className="w-full flex items-center justify-center text-muted-foreground">
                      Loading categories...
                    </div>
                  ) : categories?.length === 0 ? (
                    <div className="w-full flex items-center justify-center text-muted-foreground">
                      No categories yet
                    </div>
                  ) : (
                    categories?.map((category) => (
                      <Badge
                        key={category.id}
                        variant="secondary"
                        className="bg-background hover:bg-accent h-10 px-3 text-sm transition-colors group"
                      >
                        {category.name}
                        {category.name !== "Other" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                            onClick={(e) => handleDeleteCategory(category, e)}
                            disabled={isDeleting}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">
                              Delete {category.name}
                            </span>
                          </Button>
                        )}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isCreating || !newCategory.trim()}
              >
                {isCreating ? "Adding..." : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "
              {categoryToDelete?.name}"? This action cannot be undone. All
              passwords in this category will be moved to "Other".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
