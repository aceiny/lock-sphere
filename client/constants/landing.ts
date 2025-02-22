import { Shield, Key, Lock } from "lucide-react";

export const landingData = {
  name: "LockSphere",
  title: "Secure Password Management",
  description:
    "Keep your passwords safe and accessible with our zero-knowledge encryption technology",
  features: [
    {
      title: "Zero-Knowledge Encryption",
      description: "Your data is encrypted before it leaves your device",
      icon: Key,
    },
    {
      title: "Secure Password Generator",
      description:
        "Create strong, unique passwords with our built-in generator",
      icon: Lock,
    },
    {
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      icon: Shield,
    },
  ],
};
