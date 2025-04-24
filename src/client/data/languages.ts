export type Language = {
    value: string
    label: string
    flag: string
}

const languages: Language[] = [
    { value: "en", label: "English", flag: "🇬🇧" },
    { value: "es", label: "Spanish", flag: "🇪🇸" },
    { value: "fr", label: "French", flag: "🇫🇷" },
    { value: "de", label: "German", flag: "🇩🇪" },
    { value: "it", label: "Italian", flag: "🇮🇹" },
    { value: "pt", label: "Portuguese", flag: "🇵🇹" },
    { value: "ru", label: "Russian", flag: "🇷🇺" },
    { value: "zh", label: "Chinese", flag: "🇨🇳" },
    { value: "ja", label: "Japanese", flag: "🇯🇵" },
    { value: "ko", label: "Korean", flag: "🇰🇷" },
    { value: "ar", label: "Arabic", flag: "🇸🇦" },
]

export default languages;