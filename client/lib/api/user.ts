import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { User } from "../types/api"
import axios from "./axios"
import { showErrorToast } from "@/components/utils/toast-handler"
import { AxiosProgressEvent } from "axios"
import { DrawerTitle } from "@/components/ui/drawer"

interface UpdateUserData {
  name?: string
  email?: string
}
async function fetchUser () : Promise<User>{
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
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message)
    }
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
export function useInitiateTFA() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/user/initiate-tfa")
        return data
    },
  })
}
export function useEnableTFA() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (token : string) => {
      const { data } = await axios.post("/user/enable-tfa", {token})
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
      showErrorToast(error.response?.data?.message)
    },
  });
}