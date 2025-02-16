import { useMutation, useQuery } from "@tanstack/react-query"
import type { AuthResponse, AuthLog } from "../types/api"
import axios, { ResponseInterface } from "./axios"
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
  challange : string
  token: string
}

export function useCheckSession() {
  return useMutation({
    mutationFn: async () => {
      await axios.get("/auth/session")
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        window.location.replace("/login")
      }
    },
  })
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
      if(error.response?.data?.message != "Tfa required"){
        showErrorToast(error.response?.data?.message)
      }
    }
  })
}

// Signout
export function useSignout() {
  return useMutation({
    mutationFn: async () => {
      await axios.post("/auth/signout")
    },
    onSuccess: () => {
      window.location.replace('/')
    },
    onError: (error : any) => {
      showErrorToast(error.response?.data?.message)
    }
  })
}

// Verify TFA
export function useVerifyTFA() {
  return useMutation({
    mutationFn: async (credentials: VerifyTFACredentials) => {
      const { data } = await axios.post<AuthResponse>("/auth/verify-tfa", credentials)
      return data
    },
    onSuccess(res){
      window.location.replace('/dashboard')
    },
    onError(error : any){
      showErrorToast(error.response?.data?.message)
    }
  })
}

// Get auth logs
export function useAuthLogs(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["auth-logs", page, limit],
    queryFn: async () => {
      const { data } = await axios.get<ResponseInterface<PaginatedResponse<any>>>("/auth-log", {
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

