// Tests for i18n/translations.ts
import { getTranslations, getDayNames } from '../i18n/translations';

const SUPPORTED_LANGUAGES = ['en', 'hu', 'es', 'de'];

describe('getTranslations', () => {
    it('returns English translations for "en"', () => {
        const t = getTranslations('en');
        expect(t.appTitle).toBe('PayToSnooze');
        expect(t.settings).toBe('Settings');
        expect(t.imAwake).toBe("I'm Awake!");
        expect(t.payToSnooze).toBe('💳 Pay to snooze');
    });

    it('returns Hungarian translations for "hu"', () => {
        const t = getTranslations('hu');
        expect(t.settings).toBe('Beállítások');
        expect(t.imAwake).toBe('Ébren vagyok!');
        expect(t.cancel).toBe('Mégse');
    });

    it('returns Spanish translations for "es"', () => {
        const t = getTranslations('es');
        expect(t.settings).toBe('Ajustes');
        expect(t.imAwake).toBe('¡Estoy Despierto!');
        expect(t.cancel).toBe('Cancelar');
    });

    it('returns German translations for "de"', () => {
        const t = getTranslations('de');
        expect(t.settings).toBe('Einstellungen');
        expect(t.imAwake).toBe('Ich bin wach!');
        expect(t.cancel).toBe('Abbrechen');
    });

    it('falls back to English for unknown language code', () => {
        const t = getTranslations('fr');
        expect(t.appTitle).toBe('PayToSnooze');
        expect(t.settings).toBe('Settings');
    });

    it('falls back to English for empty string', () => {
        const t = getTranslations('');
        expect(t.appTitle).toBe('PayToSnooze');
    });
});

describe('getDayNames', () => {
    it.each(SUPPORTED_LANGUAGES)('returns 7 day names for "%s"', (lang) => {
        const days = getDayNames(lang);
        expect(days).toHaveLength(7);
        days.forEach((d) => {
            expect(typeof d).toBe('string');
            expect(d.length).toBeGreaterThan(0);
        });
    });

    it('returns English day abbreviations', () => {
        const days = getDayNames('en');
        expect(days).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    });

    it('returns Hungarian day abbreviations', () => {
        const days = getDayNames('hu');
        expect(days).toEqual(['Vas', 'Hét', 'Ked', 'Sze', 'Csü', 'Pén', 'Szo']);
    });

    it('falls back to English day names for unknown language', () => {
        const days = getDayNames('xx');
        expect(days).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    });
});

describe('translation completeness', () => {
    const englishKeys = Object.keys(getTranslations('en')).sort();

    it.each(['hu', 'es', 'de'])(
        '"%s" has all the same keys as English',
        (lang) => {
            const keys = Object.keys(getTranslations(lang)).sort();
            expect(keys).toEqual(englishKeys);
        },
    );

    it('all translations have non-empty string values', () => {
        SUPPORTED_LANGUAGES.forEach((lang) => {
            const t = getTranslations(lang);
            Object.entries(t).forEach(([key, value]) => {
                expect(typeof value).toBe('string');
                expect(value.length).toBeGreaterThan(0);
            });
        });
    });
});
