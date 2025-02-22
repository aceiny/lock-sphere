import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const FIXED_SALT = Buffer.from("TMlcjETN0bRuowgtY8zlwpM4qOHZcLjRK+", "base64"); // Use Buffer for consistency

/**
 * Derives a 256-bit AES encryption key from the master key.
 */
function deriveAESKey(masterKey: string): Buffer {
  return crypto.pbkdf2Sync(
    masterKey,
    FIXED_SALT,
    ITERATIONS,
    KEY_LENGTH,
    "sha256",
  );
}

/**
 * Encrypts a password using AES-256-CBC.
 */
export function encryptPassword(password: string, masterKey: string): string {
  const key = deriveAESKey(masterKey);
  const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV for each encryption
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(password, "utf8"),
    cipher.final(),
  ]);

  // Store IV and encrypted password as base64 for better compatibility
  return `${iv.toString("base64")}:${encrypted.toString("base64")}`;
}

/**
 * Decrypts a password using AES-256-CBC.
 */
export function decryptPassword(
  encryptedData: string,
  masterKey: string,
): string {
  const [ivBase64, encryptedBase64] = encryptedData.split(":");
  const key = deriveAESKey(masterKey);
  const iv = Buffer.from(ivBase64, "base64");
  const encrypted = Buffer.from(encryptedBase64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
