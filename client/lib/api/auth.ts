import { useMutation, useQuery } from "@tanstack/react-query"
import type { AuthResponse, AuthLog } from "../types/api"
import axios from "./axios"
import { AxiosError } from "axios"
import { showErrorToast, showSuccessToast } from "@/components/utils/toast-handler"

interface SignupCredentials {
  email: string
  password: string
  name: string
}

interface SigninCredentials {
  email: string
  password: string
}

interface VerifyTFACredentials {
  code: string
  token: string
}

// Signup
export function useSignup() {
  return useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const { data } = await axios.post<AuthResponse>("/auth/signup", credentials)
      return data
    },
    onSuccess: (data) => {
      showSuccessToast("Signup succesfull please login")
      window.location.replace('/login')
    },
    onError: (error : any) => {
      showErrorToast(error.response?.data?.message)
    }
  })
}

// Signin

export function useSignin() {
  return useMutation({
    mutationFn: async (credentials: SigninCredentials) => {
      const { data } = await axios.post<AuthResponse>("/auth/signin", credentials)
      console.log(data)
      return data
    },
    onSuccess: (data) => {
      window.location.replace('/dashboard')
    },
    onError: (error : any) => {
      showErrorToast(error.response?.data?.message)
    }
  })
}

// Signout
export function useSignout() {
  return useMutation({
    mutationFn: async () => {
      await axios.post("/auth/signout")
    },
  })
}

// Verify TFA
export function useVerifyTFA() {
  return useMutation({
    mutationFn: async (credentials: VerifyTFACredentials) => {
      const { data } = await axios.post<AuthResponse>("/auth/verify-tfa", credentials)
      return data
    },
  })
}

// Get auth logs
export function useAuthLogs(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["auth-logs", page, limit],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<AuthLog>>("/auth-log", {
        params: { page, limit },
      })
      return data
    },
  })
}


interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

