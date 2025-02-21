"use client"

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Check, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";

type Strength = "weak" | "medium" | "strong";

const strengthVariants: Record<Strength, "success" | "destructive" | "secondary"> = {
  weak: "destructive",
  medium: "secondary",
  strong: "success",
};

const generatePassword = (length: number, options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }): string => {
  const charSets: Record<string, string> = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+{}[]<>?/",
  };
  let allChars = "";
  let password = "";

  Object.entries(options).forEach(([key, value]) => {
    if (value) allChars += charSets[key];
  });

  if (!allChars) return "";

  for (let i = 0; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password;
};

const getPasswordStrength = (password: string): Strength => {
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

  const sequences = ['abcdefghijklmnopqrstuvwxyz', '0123456789', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  const lowercasePassword = password.toLowerCase();
  
  let hasSequential = false;
  for (const sequence of sequences) {
    for (let i = 3; i <= sequence.length; i++) {
      for (let j = 0; j <= sequence.length - i; j++) {
        const substr = sequence.substr(j, i);
        if (lowercasePassword.includes(substr) || 
            lowercasePassword.includes(substr.split('').reverse().join(''))) {
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
    'password', '123456', 'qwerty', 'admin', 'welcome', 
    'letmein', 'monkey', 'abc123', 'football'
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

export default function GeneratorPage() {
  const [password, setPassword] = React.useState<string>("");
  const [length, setLength] = React.useState<number>(16);
  const [copied, setCopied] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [strength, setStrength] = React.useState<Strength>("medium");

  React.useEffect(() => {
    const newPassword = generatePassword(length, options);
    setPassword(newPassword);
    setStrength(getPasswordStrength(newPassword));
  }, [length, options]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Password Generator</h1>
        <p className="text-muted-foreground">Generate strong, secure passwords</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Generated Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <div className="flex gap-2">
                <Input readOnly value={password} className="font-mono text-lg" />
                <Button variant="outline" size="icon" onClick={copyPassword}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPassword(generatePassword(length, options))}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Password Length:</Label>
                <Input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Math.max(8, Math.min(128, Number(e.target.value))))}
                  className="w-20 text-center appearance-none"
                />
                <Badge variant={strengthVariants[strength]} className="ml-2">
                  {strength.charAt(0).toUpperCase() + strength.slice(1)}
                </Badge>
              </div>
              <Slider value={[length]} max={128} min={8} step={1} onValueChange={(val) => setLength(val[0])} />
            </div>

            {Object.entries(options).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="capitalize">
                  {key} Letters
                </Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, [key]: checked }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
