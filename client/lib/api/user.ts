import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { User } from "../types/api"
import axios from "./axios"
import { showErrorToast } from "@/components/utils/toast-handler"
import { AxiosProgressEvent } from "axios"

interface UpdateUserData {
  name?: string
  email?: string
}
async function fetchUser (){
  const { data } = await axios.get("/user")
  return data.data
}
// Get user profile
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser
  })
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userData: UpdateUserData) => {
      const { data } = await axios.patch<User>("/user", userData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
}

// Delete user
export function useDeleteUser() {
  return useMutation({
    mutationFn: async () => {
      await axios.delete("/user")
    },
  })
}

// Enable TFA
export function useEnableTFA() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post<User>("/user/enable-tfa")
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
}

// Disable TFA
export function useDisableTFA() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post<User>("/user/disable-tfa")
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
}
interface UploadOptions {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export function useUpdateProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { formData: FormData; options?: UploadOptions }>({
    mutationFn: async ({ formData, options }) => {
      const { data: responseData } = await axios.patch<User>(
        '/user/update-avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: options?.onUploadProgress,
        }
      );
      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      showErrorToast(error.response?.data?.message)
    },
  });
}