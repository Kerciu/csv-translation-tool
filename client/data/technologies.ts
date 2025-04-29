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
      used: "TypeScript (React + Next.js) & Tailwind CSS - Modern reactive UI", 
      icon: Code2 
    },
    { 
      category: "Backend", 
      used: "Django - Robust API endpoints with Django's ORM and authentication", 
      icon: Cpu 
    },
    { 
      category: "Database", 
      used: "MongoDB - NoSQL database for flexible document storage and queries", 
      icon: Database 
    },
    { 
      category: "ML Translation & Language Bindings", 
      used: "HuggingFace's MarianMT models in Rust & PyO3 - High-performance machine translation", 
      icon: BrainCircuit 
    },
    { 
      category: "Infrastructure", 
      used: "Docker & Redis - Containerized deployment with in-memory caching layer", 
      icon: Container 
    },
    { 
      category: "Security", 
      used: "JWT & OAuth2 - Token-based authentication and third-party login flows", 
      icon: Lock 
    },
];

export default technologies;