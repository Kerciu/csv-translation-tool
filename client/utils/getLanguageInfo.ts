import languages from "@/data/languages"

export const getLanguageInfo = (code: string) => {
    return languages.find((lang) => lang.value === code) || { value: code, label: code, flag: "🌐" }
}
