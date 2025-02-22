import { Strength } from "./types/common";

export const getPasswordStrength = (password: string): Strength => {
  let score = 0;

  if (password.length >= 16) {
    score += 3;
  } else if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~]/.test(password);

  if (hasUpper) score += 1;
  if (hasLower) score += 1;
  if (hasNumber) score += 1;
  if (hasSymbol) score += 1;

  const repeatedChars = /(.)\1{2,}/;
  if (repeatedChars.test(password)) {
    score -= 1;
  }

  const sequences = [
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
  ];
  const lowercasePassword = password.toLowerCase();

  let hasSequential = false;
  for (const sequence of sequences) {
    for (let i = 3; i <= sequence.length; i++) {
      for (let j = 0; j <= sequence.length - i; j++) {
        const substr = sequence.substr(j, i);
        if (
          lowercasePassword.includes(substr) ||
          lowercasePassword.includes(substr.split("").reverse().join(""))
        ) {
          hasSequential = true;
          break;
        }
      }
      if (hasSequential) break;
    }
    if (hasSequential) {
      score -= 1;
      break;
    }
  }

  const commonPatterns = [
    "password",
    "123456",
    "qwerty",
    "admin",
    "welcome",
    "letmein",
    "monkey",
    "abc123",
    "football",
  ];

  for (const pattern of commonPatterns) {
    if (lowercasePassword.includes(pattern)) {
      score -= 2;
      break;
    }
  }

  const uniqueChars = new Set(password).size;
  const entropy = Math.log2(Math.pow(uniqueChars, password.length));
  if (entropy > 60) score += 1;
  if (entropy > 80) score += 1;

  score = Math.max(0, score);

  if (score <= 3) return "weak";
  if (score <= 6) return "medium";
  return "strong";
};
