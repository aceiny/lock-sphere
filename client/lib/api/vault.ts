import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Vault } from "../types/api";
import axios from "./axios";

interface CreateVaultData {
  identifier: string;
  encrypted_payload: string;
  website_name: string;
  website_url?: string;
  category?: string | undefined;
}

// Create vault
export function useCreateVault() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateVaultData) => {
      console.log(data);
      const response = await axios.post<Vault>("/vault", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
    },
  });
}

// Get all vaults
export function useVaults() {
  return useQuery({
    queryKey: ["vaults"],
    queryFn: async () => {
      const { data } = await axios.get<any>("/vault");
      return data;
    },
  });
}

// Get vault by id
export function useVault(id: string) {
  return useQuery({
    queryKey: ["vaults", id],
    queryFn: async () => {
      const { data } = await axios.get<Vault>(`/vault/${id}`);
      return data;
    },
  });
}

// Update vault
export function useUpdateVault() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: CreateVaultData & { id: string }) => {
      const response = await axios.patch<Vault>(`/vault/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      queryClient.invalidateQueries({ queryKey: ["vaults", variables.id] });
    },
  });
}

// Delete vault
export function useDeleteVault() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/vault/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
    },
  });
}

// Add category to vault
export function useAddCategoryToVault() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      vaultId,
      categoryId,
    }: {
      vaultId: string;
      categoryId: string;
    }) => {
      const response = await axios.post(`/vault/category/${vaultId}`, {
        categoryId,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      queryClient.invalidateQueries({
        queryKey: ["vaults", variables.vaultId],
      });
    },
  });
}

// Remove category from vault
export function useRemoveCategoryFromVault() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      vaultId,
      categoryId,
    }: {
      vaultId: string;
      categoryId: string;
    }) => {
      await axios.delete(`/vault/category/${vaultId}`, {
        data: { categoryId },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      queryClient.invalidateQueries({
        queryKey: ["vaults", variables.vaultId],
      });
    },
  });
}

