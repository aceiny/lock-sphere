/* eslint-disable */ // for now to avoid buildin errors
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Copy, RefreshCw, Check, Zap } from "lucide-react";

const strengthColors = {
  weak: "bg-destructive",
  medium: "bg-yellow-500",
  strong: "bg-green-500",
};

export default function GeneratorPage() {
  const [password, setPassword] = React.useState("P@ssw0rd123!");
  const [length, setLength] = React.useState([16]);
  const [copied, setCopied] = React.useState(false);
  const [options, setOptions] = React.useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [strength, setStrength] =
    React.useState<keyof typeof strengthColors>("medium");

  const generatePassword = () => {
    // TODO: Implement proper password generation
    setPassword("NewP@ssw0rd" + Math.random().toString(36).slice(-4));
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Password Generator
        </h1>
        <p className="text-muted-foreground">
          Generate strong, secure passwords
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Generated Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={password}
                  className="font-mono text-lg"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyPassword}
                  className="relative"
                >
                  <motion.div
                    animate={copied ? { scale: 0 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Copy className="h-4 w-4" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={copied ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={generatePassword}
                  className="relative overflow-hidden"
                >
                  <motion.div
                    whileTap={{ rotate: 360 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Password Length: {length}</Label>
                  <span className="text-sm text-muted-foreground">
                    Strength:
                    <motion.span
                      key={strength}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-2 inline-flex items-center"
                    >
                      <Zap
                        className={`h-4 w-4 mr-1 ${
                          strength === "weak"
                            ? "text-destructive"
                            : strength === "medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                        }`}
                      />
                      {strength.charAt(0).toUpperCase() + strength.slice(1)}
                    </motion.span>
                  </span>
                </div>
                <div className="relative pt-1">
                  <Slider
                    value={length}
                    max={32}
                    min={8}
                    step={1}
                    onValueChange={setLength}
                    className="z-10"
                  />
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className={`h-2 w-full rounded-full ${strengthColors[strength]} opacity-20`}
                    />
                  </div>
                </div>
              </div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {Object.entries(options).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    className="flex items-center justify-between"
                  >
                    <Label htmlFor={key} className="capitalize">
                      {key} Letters
                    </Label>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({ ...prev, [key]: checked }))
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
