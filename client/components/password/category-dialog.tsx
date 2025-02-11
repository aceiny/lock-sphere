"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const [categories, setCategories] = React.useState([
    "Social",
    "Work",
    "Finance",
    "Shopping",
    "Other",
  ]);
  const [newCategory, setNewCategory] = React.useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (category !== "Other") {
      setCategories(categories.filter((c) => c !== category));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add or remove password categories
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddCategory} className="space-y-4 py-4">
          <div className="flex gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="category">New Category</Label>
              <Input
                id="category"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <Button type="submit" className="self-end">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add category</span>
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Current Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="bg-primary/10 hover:bg-primary/20 transition-colors group"
                >
                  {category}
                  {category !== "Other" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Delete {category}</span>
                    </Button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
