"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, X } from "lucide-react"
import { CategoryDialog } from "./category-dialog"

interface CategoryBadgeProps {
  category: string
  onEdit?: (category: string) => void
  onDelete?: (category: string) => void
  editable?: boolean
}

export function CategoryBadge({ category, onEdit, onDelete, editable = true }: CategoryBadgeProps) {
  const [showEditDialog, setShowEditDialog] = React.useState(false)

  return (
    <>
      <Badge
        variant="secondary"
        className="group relative bg-primary/10 hover:bg-primary/20 transition-colors px-3 py-1"
      >
        {category}
        {editable && category !== "Other" && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                setShowEditDialog(true)
              }}
            >
              <Pencil className="h-3 w-3" />
              <span className="sr-only">Edit {category}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 hover:bg-transparent text-red-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(category)
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Delete {category}</span>
            </Button>
          </div>
        )}
      </Badge>

      <CategoryDialog open={showEditDialog} onOpenChange={setShowEditDialog} mode="edit" initialCategory={category} />
    </>
  )
}

