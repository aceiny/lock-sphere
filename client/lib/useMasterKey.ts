"use client";
import { useState, useEffect } from "react";
import crypto from "crypto";
import secureLocalStorage from "react-secure-storage";
import { useCreateOrCheckMasterKey } from "./api/user";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/utils/toast-handler";

const MASTER_KEY_STORAGE = "master_key";
const FIXED_SALT = Buffer.from("TMlcjETN0bRuowgtY8zlwpM4qOHZcLjRK+", "base64"); // Use Buffer for consistency

function deriveMasterKeyHash(masterKey: string): string {
  return crypto
    .pbkdf2Sync(masterKey, FIXED_SALT, 100000, 64, "sha256")
    .toString("hex");
}

export function useMasterKey() {
  const [masterKey, setMasterKey] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    const storedKey = secureLocalStorage.getItem(MASTER_KEY_STORAGE);
    if (storedKey) {
      setMasterKey(storedKey as string);
      setIsVerified(true);
    }
  }, [masterKey, isVerified]);

  const { mutate: mutateCreateOrCheckMasterKey } = useCreateOrCheckMasterKey();

  function handleMasterKey(key: string) {
    const hashedKey = deriveMasterKeyHash(key);

    mutateCreateOrCheckMasterKey(hashedKey, {
      onSuccess: (data: any) => {
        secureLocalStorage.setItem(MASTER_KEY_STORAGE, hashedKey);
        setMasterKey(hashedKey);
        setIsVerified(true);
        showSuccessToast(data.message);
        window.location.reload(); // for now untill i debug why master key not syncing
      },
      onError: (error: any) => {
        showErrorToast(
          error.response?.data?.message || "Failed to verify master key",
        );
      },
    });
  }

  /**
   * Clears the master key when the user logs out.
   */
  function clearMasterKey() {
    secureLocalStorage.removeItem(MASTER_KEY_STORAGE);
    setMasterKey(null);
    setIsVerified(false);
  }

  return { masterKey, isVerified, handleMasterKey, clearMasterKey };
}
