"use client"
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/utils/LoadingScreen";

const AuthLoading = () => {
  const router = useRouter();
  router.replace("/dashboard");
  return (
    <div>
        <LoadingScreen />
    </div>
  );
};

export default AuthLoading;
