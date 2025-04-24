import { FileSpreadsheet, Languages, Edit3, Download, Save, Shield, LucideIcon } from "lucide-react"

type Feature = {
    icon: LucideIcon,
    title: string,
    description: string
}

const features: Feature[] = [
    {
      icon: FileSpreadsheet,
      title: "CSV Parsing",
      description: "Upload and parse CSV files of any size with our powerful processing engine."
    },
    {
      icon: Languages,
      title: "Multiple Languages",
      description: "Translate your content into 10+ languages with high accuracy and natural phrasing."
    },
    {
      icon: Edit3,
      title: "Manual Editing",
      description: "Fine-tune translations with our intuitive editing capabilities."
    },
    {
      icon: Download,
      title: "Easy Export",
      description: "Download your translated CSV files with a single click, ready for use."
    },
    {
      icon: Save,
      title: "Lasting Progress",
      description: "Leave your translation progress and continue working on it later."
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Your data is secure with our encrypted storage."
    }
];

export default features
