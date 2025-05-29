export type Language = {
  value: string;
  label: string;
  flag: string;
};

const languages: Language[] = [
  { value: 'auto', label: 'Auto Detect', flag: '🌐' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'pl', label: 'Polish', flag: '🇵🇱' },
  { value: 'it', label: 'Italian', flag: '🇮🇹' },
  { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'ru', label: 'Russian', flag: '🇷🇺' },
  { value: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { value: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { value: 'ko', label: 'Korean', flag: '🇰🇷' },
  { value: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { value: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { value: 'id', label: 'Indonesian', flag: '🇮🇩' },
  { value: 'nl', label: 'Dutch', flag: '🇳🇱' },
  { value: 'sv', label: 'Swedish', flag: '🇸🇪' },
  { value: 'th', label: 'Thai', flag: '🇹🇭' },
  { value: 'tr', label: 'Turkish', flag: '🇹🇷' },
  { value: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
];

export default languages;
