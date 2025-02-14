import { useSignout } from "@/lib/api/auth"

export const signOut = async () => {
  const signout = useSignout()
  try {
    await signout.mutateAsync()
    localStorage.removeItem("token")
    window.location.href = "/login"
  } catch (error) {
    console.error("Signout failed:", error)
    // Still remove token and redirect on error
    localStorage.removeItem("token")
    window.location.href = "/login"
  }
}

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("token")
}

