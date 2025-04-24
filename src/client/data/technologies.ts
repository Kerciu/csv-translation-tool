import { 
    Code2, 
    Cpu, 
    Database, 
    BrainCircuit, 
    HardDrive, 
    Lock, 
    Container 
  } from "lucide-react";
  import type { LucideIcon } from "lucide-react";
  
  export type Technology = {
    category: string;
    used: string;
    icon: LucideIcon;
  };
  
  const technologies: Technology[] = [
    { 
      category: "Frontend", 
      used: "TypeScript (React + Next.js) & Tailwind CSS", 
      icon: Code2 
    },
    { 
      category: "Backend", 
      used: "Django REST (Python)", 
      icon: Cpu 
    },
    { 
      category: "Database", 
      used: "MongoDB", 
      icon: Database 
    },
    { 
      category: "ML Translation", 
      used: "HuggingFace's MarianMT models in Rust & PyO3", 
      icon: BrainCircuit 
    },
    { 
      category: "Infrastructure", 
      used: "Docker & Redis", 
      icon: Container 
    },
    { 
      category: "Security", 
      used: "JWT & OAuth2", 
      icon: Lock 
    },
];

export default technologies;