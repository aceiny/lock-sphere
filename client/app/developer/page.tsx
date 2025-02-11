"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Globe, Twitter } from "lucide-react";
import { developerData } from "@/constant/developer.data";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DeveloperPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Developer</h1>
        <p className="text-muted-foreground">
          About the developer and project information
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2"
      >
        <motion.div variants={item} className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-primary/10">
                  <img
                    src="/placeholder.svg"
                    alt="Developer"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{developerData.name}</h2>
                  <p className="text-muted-foreground">{developerData.role}</p>
                </div>
              </CardTitle>
              <CardDescription className="mt-4 text-base">
                {developerData.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {developerData.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Contact & Social</CardTitle>
              <CardDescription>Get in touch or follow my work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                className="grid gap-4"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {developerData.socialMedia.map((social) => (
                  <motion.div key={social.title} variants={item}>
                    <Button
                      variant="outline"
                      className="w-full gap-2 justify-start"
                      asChild
                    >
                      <a
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.title}
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Featured Projects</CardTitle>
              <CardDescription>Some of my recent work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {developerData.projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  variants={item}
                  className="group rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <Github className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </a>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
