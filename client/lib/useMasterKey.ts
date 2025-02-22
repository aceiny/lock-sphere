"use client";
import { useState, useEffect } from "react";
import crypto from "crypto";
import secureLocalStorage from "react-secure-storage";

const MASTER_KEY_STORAGE = "master_key";
const SALT_STORAGE = "master_salt";

/**
 * Derives a secure hash from the master key using PBKDF2.
 * @param {string} masterKey - The user's master key.
 * @param {string} salt - A unique salt for hashing.
 * @returns {string} The derived hash.
 */
function deriveMasterKeyHash(masterKey: string, salt: string): string {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, 64, "sha256").toString("hex");
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
  }, []);

  /**
   * Stores the master key securely on the client.
   * @param {string} key - The master key entered by the user.
   */
  function storeMasterKey(key: string) {
    const salt = crypto.randomBytes(16).toString("hex"); // Generate a new salt
    const derivedKey = deriveMasterKeyHash(key, salt);
    
    secureLocalStorage.setItem(MASTER_KEY_STORAGE, derivedKey);
    secureLocalStorage.setItem(SALT_STORAGE, salt);
    setMasterKey(derivedKey);
    setIsVerified(true);
  }

  /**
   * Verifies if the entered master key is correct by rehashing it.
   * @param {string} key - The master key entered by the user.
   * @returns {boolean} True if the key is correct, false otherwise.
   */
  function verifyMasterKey(key: string): boolean {
    const storedSalt = secureLocalStorage.getItem(SALT_STORAGE) as string;
    const storedHash = secureLocalStorage.getItem(MASTER_KEY_STORAGE) as string;

    if (!storedSalt || !storedHash) return false;

    const inputHash = deriveMasterKeyHash(key, storedSalt);
    const isValid = inputHash === storedHash;

    if (isValid) {
      setMasterKey(inputHash);
      setIsVerified(true);
    }
    
    return isValid;
  }

  /**
   * Clears the master key when the user logs out.
   */
  function clearMasterKey() {
    secureLocalStorage.removeItem(MASTER_KEY_STORAGE);
    secureLocalStorage.removeItem(SALT_STORAGE);
    setMasterKey(null);
    setIsVerified(false);
  }

  return { masterKey, isVerified, storeMasterKey, verifyMasterKey, clearMasterKey };
}
