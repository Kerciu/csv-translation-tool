import { FileSpreadsheet, Languages, Edit3, Download, Save, Shield, LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

type Feature = {
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
    title: string,
    description: string
}
