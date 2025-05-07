import languages from '@/data/languages';

export const getLanguageName = (code: string) => {
  return languages.find((lang) => lang.value === code)?.label;
};
