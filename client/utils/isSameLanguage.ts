import { getLanguageInfo } from "./getLanguageInfo";

export const isSameLanguage = (source: string, target: string) => {
    if (source === 'auto') return false;
    const srcInfo = getLanguageInfo(source);
    const tgtInfo = getLanguageInfo(target);
    return srcInfo.value === tgtInfo.value;
};