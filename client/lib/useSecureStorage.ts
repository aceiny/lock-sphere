"use client";
import secureLocalStorage from "react-secure-storage";
import { useState, useEffect } from "react";

const MASTER_KEY_STORAGE = "master_key";

export function useSecureStorage() {
  const [masterKey, setMasterKey] = useState<string | null>(null);

  // Load master key from secure storage on component mount
  useEffect(() => {
    const storedKey = secureLocalStorage.getItem(MASTER_KEY_STORAGE);
    if (storedKey) {
      setMasterKey(storedKey as string);
    }
  }, []);

  // Store the master key securely
  function storeMasterKey(key: string) {
    secureLocalStorage.setItem(MASTER_KEY_STORAGE, key);
    setMasterKey(key);
  }

  // Clear the master key on logout
  function clearMasterKey() {
    secureLocalStorage.removeItem(MASTER_KEY_STORAGE);
    setMasterKey(null);
  }

  return { masterKey, storeMasterKey, clearMasterKey };
}
