import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category } from "../types/api";
import axios, { ResponseInterface } from "./axios";

// Create category
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await axios.post<Category>("/category", { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// Get all categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } =
        await axios.get<ResponseInterface<Category[]>>("/category");
      return data.data;
    },
  });
}

// Get category by id
export function useCategory(id: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const { data } = await axios.get<Category>(`/category/${id}`);
      return data;
    },
  });
}

// Delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/category/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
