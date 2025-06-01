import languages from '@/data/languages';

export const getLanguageInfo = (code: string) => {
  if (code === 'auto') {
    return { value: 'auto', label: 'Auto Detect', flag: '🌐' };
  }
  return languages.find((lang) => lang.value === code) || { value: code, label: code, flag: '🌐' };
};
