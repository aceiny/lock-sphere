"use client";
import * as React from "react";
import { Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Database, User, SettingsIcon, Activity } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import SettingsActivity from "@/components/settings/SettingsActivity";
import SettingsPreferences from "@/components/settings/SettingsPreferences";
import SettingsSecurity from "@/components/settings/SettingsSecurity";
import SettingsData from "@/components/settings/SettingsData";
import SettingsProfile from "@/components/settings/SettingsProfile";

const sections = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: SettingsIcon,
  },
  {
    id: "activity",
    label: "Activity",
    icon: Activity,
  },
  {
    id: "data",
    label: "Data Management",
    icon: Database,
  },
];

function SettingsContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = React.useState(
    searchParams.get("section") || "profile",
  );

  React.useEffect(() => {
    const section = searchParams.get("section");
    if (section && sections.some((s) => s.id === section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-72 flex-shrink-0 border-0">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-3 w-full rounded-lg px-4 py-3 text-base transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground font-medium shadow-md"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <section.icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      activeSection === section.id && "scale-110",
                    )}
                  />
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeSection === "profile" && <SettingsProfile />}

            {activeSection === "security" && <SettingsSecurity />}

            {activeSection === "activity" && <SettingsActivity />}

            {activeSection === "preferences" && <SettingsPreferences />}

            {activeSection === "data" && <SettingsData />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
