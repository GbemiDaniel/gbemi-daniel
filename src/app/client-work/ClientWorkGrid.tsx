"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";

type Project = {
  key: string;
  title: string;
  description: string;
  category: string;
  tagList: string[];
  year: string;
  href: string;
  imgSrc: string;
  featured: boolean;
};

export default function ClientWorkGrid({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Reveal
      stagger={0.08}
      className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-7 max-[700px]:gap-5"
    >
      {projects.map((p) => (
        <ProjectCard
          key={p.key}
          project={p}
          hovered={hovered === p.key}
          onHoverStart={() => setHovered(p.key)}
          onHoverEnd={() => setHovered(null)}
        />
      ))}
    </Reveal>
  );
}
