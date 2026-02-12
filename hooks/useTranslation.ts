// Hook to get translations based on current language setting
import { getTranslations, getDayNames } from '../i18n/translations';
import { useSettings } from './useAlarms';

export function useTranslation() {
    const { settings } = useSettings();
    const lang = settings?.language || 'en';
    const t = getTranslations(lang);
    const dayNames = getDayNames(lang);

    return { t, dayNames, lang };
}
