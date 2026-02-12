// Internationalization - all UI translations
// Supported languages: en (English), hu (Hungarian), es (Spanish), de (German)

export type Language = 'en' | 'hu' | 'es' | 'de';

const translations: Record<Language, Record<string, string>> = {
    en: {
        // Navigation / Headers
        appTitle: 'PayToSnooze',
        settings: 'Settings',
        profile: 'Profile',
        createAlarm: 'Create Alarm',
        editAlarm: 'Edit Alarm',

        // Home screen
        noAlarmsYet: 'No Alarms Yet',
        noAlarmsSubtitle: 'Tap + to create your first pay-to-snooze alarm',
        oneTime: 'One time',
        toSnooze: 'to snooze',
        loading: 'Loading...',

        // Days
        sun: 'Sun',
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',

        // Create / Edit shared
        label: 'Label',
        labelPlaceholder: 'Wake up!',
        repeat: 'Repeat',
        snoozePriceTitle: 'Snooze Price 💰',
        snoozePriceSubtitle: 'Minimum $1.00 - make it hurt!',
        snoozeDuration: 'Snooze Duration',
        min: 'min',
        other: 'Other',
        enterMinutes: 'Enter minutes',
        minutes: 'minutes',
        cancel: 'Cancel',

        // Create screen
        createAlarmButton: 'Create Alarm',

        // Edit screen
        saveChanges: 'Save Changes',
        deleteAlarm: 'Delete Alarm',
        deleteConfirmTitle: 'Delete Alarm',
        deleteConfirmMessage: 'Are you sure you want to delete this alarm?',
        delete: 'Delete',
        invalidPrice: 'Invalid Price',
        invalidPriceMessage: 'Snooze price must be at least $1.00',
        invalidTime: 'Invalid Time',
        invalidTimeMessage: 'Please enter a valid time',

        // Settings screen
        language: '🌐 Language',
        weekStartsOn: '📅 Week Starts On',
        defaultSnoozePrice: '💰 Default Snooze Price',
        defaultSnoozePriceSubtitle: 'New alarms will use this price',
        defaultSnoozeDuration: '⏱️ Default Snooze Duration',

        // Profile screen
        sleepyhead: 'Sleepyhead',
        member: 'PayToSnooze Member',
        totalSpentOnSnoozing: 'Total Spent on Snoozing',
        spentALot: "That's a lot of 💤! Try waking up on time!",
        stayedDisciplined: 'Great job staying disciplined!',
        snoozePrice: 'Snooze Price',
        snoozeDurationLabel: 'Snooze Duration',
        aboutText: 'The alarm clock that makes you pay to snooze.\nNo more "just 5 more minutes"!',
        version: 'Version 1.0.0',
        resetStatistics: 'Reset Statistics',
        resetConfirm: 'Are you sure you want to reset your statistics?',
        reset: 'Reset',

        // Ringing screen
        payToSnooze: '💳 Pay to snooze',
        snoozeMin: 'Snooze {0} min',
        imAwake: "I'm Awake!",
        free: 'Free',

        // Time Picker
        setTime: 'Set Time',
        hour: 'Hour',
        minute: 'Minute',
        set: 'Set',
    },

    hu: {
        // Navigation / Headers
        appTitle: 'PayToSnooze',
        settings: 'Beállítások',
        profile: 'Profil',
        createAlarm: 'Ébresztő létrehozása',
        editAlarm: 'Ébresztő szerkesztése',

        // Home screen
        noAlarmsYet: 'Még nincsenek ébresztők',
        noAlarmsSubtitle: 'Nyomd meg a + gombot az első ébresztő létrehozásához',
        oneTime: 'Egyszeri',
        toSnooze: 'szundi',
        loading: 'Betöltés...',

        // Days
        sun: 'Vas',
        mon: 'Hét',
        tue: 'Ked',
        wed: 'Sze',
        thu: 'Csü',
        fri: 'Pén',
        sat: 'Szo',

        // Create / Edit shared
        label: 'Címke',
        labelPlaceholder: 'Ébresztő!',
        repeat: 'Ismétlés',
        snoozePriceTitle: 'Szundi ára 💰',
        snoozePriceSubtitle: 'Minimum $1.00 - legyen fájdalmas!',
        snoozeDuration: 'Szundi időtartama',
        min: 'perc',
        other: 'Egyéb',
        enterMinutes: 'Add meg a perceket',
        minutes: 'perc',
        cancel: 'Mégse',

        // Create screen
        createAlarmButton: 'Ébresztő létrehozása',

        // Edit screen
        saveChanges: 'Módosítások mentése',
        deleteAlarm: 'Ébresztő törlése',
        deleteConfirmTitle: 'Ébresztő törlése',
        deleteConfirmMessage: 'Biztosan törölni szeretnéd ezt az ébresztőt?',
        delete: 'Törlés',
        invalidPrice: 'Érvénytelen ár',
        invalidPriceMessage: 'A szundi ára legalább $1.00 kell legyen',
        invalidTime: 'Érvénytelen idő',
        invalidTimeMessage: 'Kérlek adj meg érvényes időpontot',

        // Settings screen
        language: '🌐 Nyelv',
        weekStartsOn: '📅 A hét kezdőnapja',
        defaultSnoozePrice: '💰 Alapértelmezett szundi ár',
        defaultSnoozePriceSubtitle: 'Új ébresztők ezt az árat használják',
        defaultSnoozeDuration: '⏱️ Alapértelmezett szundi idő',

        // Profile screen
        sleepyhead: 'Álomszuszék',
        member: 'PayToSnooze Tag',
        totalSpentOnSnoozing: 'Összesen szundira költve',
        spentALot: 'Ez sok 💤! Próbálj meg időben felkelni!',
        stayedDisciplined: 'Szép munka, fegyelmezett voltál!',
        snoozePrice: 'Szundi ára',
        snoozeDurationLabel: 'Szundi ideje',
        aboutText: 'Az ébresztőóra, ami fizetésre kényszerít a szundiért.\nNincs több „még 5 perc"!',
        version: 'Verzió 1.0.0',
        resetStatistics: 'Statisztikák törlése',
        resetConfirm: 'Biztosan törölni szeretnéd a statisztikákat?',
        reset: 'Törlés',

        // Ringing screen
        payToSnooze: '💳 Fizess a szundiért',
        snoozeMin: 'Szundi {0} perc',
        imAwake: 'Ébren vagyok!',
        free: 'Ingyenes',

        // Time Picker
        setTime: 'Idő beállítása',
        hour: 'Óra',
        minute: 'Perc',
        set: 'Beállítás',
    },

    es: {
        // Navigation / Headers
        appTitle: 'PayToSnooze',
        settings: 'Ajustes',
        profile: 'Perfil',
        createAlarm: 'Crear Alarma',
        editAlarm: 'Editar Alarma',

        // Home screen
        noAlarmsYet: 'Sin Alarmas',
        noAlarmsSubtitle: 'Toca + para crear tu primera alarma',
        oneTime: 'Una vez',
        toSnooze: 'por snooze',
        loading: 'Cargando...',

        // Days
        sun: 'Dom',
        mon: 'Lun',
        tue: 'Mar',
        wed: 'Mié',
        thu: 'Jue',
        fri: 'Vie',
        sat: 'Sáb',

        // Create / Edit shared
        label: 'Etiqueta',
        labelPlaceholder: '¡Despierta!',
        repeat: 'Repetir',
        snoozePriceTitle: 'Precio Snooze 💰',
        snoozePriceSubtitle: 'Mínimo $1.00 - ¡que duela!',
        snoozeDuration: 'Duración Snooze',
        min: 'min',
        other: 'Otro',
        enterMinutes: 'Ingresa minutos',
        minutes: 'minutos',
        cancel: 'Cancelar',

        // Create screen
        createAlarmButton: 'Crear Alarma',

        // Edit screen
        saveChanges: 'Guardar Cambios',
        deleteAlarm: 'Eliminar Alarma',
        deleteConfirmTitle: 'Eliminar Alarma',
        deleteConfirmMessage: '¿Estás seguro de que quieres eliminar esta alarma?',
        delete: 'Eliminar',
        invalidPrice: 'Precio Inválido',
        invalidPriceMessage: 'El precio debe ser al menos $1.00',
        invalidTime: 'Hora Inválida',
        invalidTimeMessage: 'Ingresa una hora válida',

        // Settings screen
        language: '🌐 Idioma',
        weekStartsOn: '📅 La semana comienza el',
        defaultSnoozePrice: '💰 Precio Snooze por defecto',
        defaultSnoozePriceSubtitle: 'Las nuevas alarmas usarán este precio',
        defaultSnoozeDuration: '⏱️ Duración Snooze por defecto',

        // Profile screen
        sleepyhead: 'Dormilón',
        member: 'Miembro PayToSnooze',
        totalSpentOnSnoozing: 'Total gastado en snooze',
        spentALot: '¡Eso es mucho 💤! ¡Intenta despertar a tiempo!',
        stayedDisciplined: '¡Buen trabajo manteniéndote disciplinado!',
        snoozePrice: 'Precio Snooze',
        snoozeDurationLabel: 'Duración Snooze',
        aboutText: 'El despertador que te hace pagar por snooze.\n¡No más "solo 5 minutos más"!',
        version: 'Versión 1.0.0',
        resetStatistics: 'Restablecer Estadísticas',
        resetConfirm: '¿Estás seguro de que quieres restablecer tus estadísticas?',
        reset: 'Restablecer',

        // Ringing screen
        payToSnooze: '💳 Paga por snooze',
        snoozeMin: 'Snooze {0} min',
        imAwake: '¡Estoy Despierto!',
        free: 'Gratis',

        // Time Picker
        setTime: 'Establecer Hora',
        hour: 'Hora',
        minute: 'Minuto',
        set: 'Aceptar',
    },

    de: {
        // Navigation / Headers
        appTitle: 'PayToSnooze',
        settings: 'Einstellungen',
        profile: 'Profil',
        createAlarm: 'Wecker erstellen',
        editAlarm: 'Wecker bearbeiten',

        // Home screen
        noAlarmsYet: 'Keine Wecker',
        noAlarmsSubtitle: 'Tippe auf + um deinen ersten Wecker zu erstellen',
        oneTime: 'Einmalig',
        toSnooze: 'zum Schlummern',
        loading: 'Laden...',

        // Days
        sun: 'So',
        mon: 'Mo',
        tue: 'Di',
        wed: 'Mi',
        thu: 'Do',
        fri: 'Fr',
        sat: 'Sa',

        // Create / Edit shared
        label: 'Bezeichnung',
        labelPlaceholder: 'Aufwachen!',
        repeat: 'Wiederholen',
        snoozePriceTitle: 'Schlummerpreis 💰',
        snoozePriceSubtitle: 'Mindestens $1.00 - es soll wehtun!',
        snoozeDuration: 'Schlummerdauer',
        min: 'Min',
        other: 'Andere',
        enterMinutes: 'Minuten eingeben',
        minutes: 'Minuten',
        cancel: 'Abbrechen',

        // Create screen
        createAlarmButton: 'Wecker erstellen',

        // Edit screen
        saveChanges: 'Änderungen speichern',
        deleteAlarm: 'Wecker löschen',
        deleteConfirmTitle: 'Wecker löschen',
        deleteConfirmMessage: 'Bist du sicher, dass du diesen Wecker löschen möchtest?',
        delete: 'Löschen',
        invalidPrice: 'Ungültiger Preis',
        invalidPriceMessage: 'Der Schlummerpreis muss mindestens $1.00 betragen',
        invalidTime: 'Ungültige Zeit',
        invalidTimeMessage: 'Bitte gib eine gültige Zeit ein',

        // Settings screen
        language: '🌐 Sprache',
        weekStartsOn: '📅 Woche beginnt am',
        defaultSnoozePrice: '💰 Standard-Schlummerpreis',
        defaultSnoozePriceSubtitle: 'Neue Wecker verwenden diesen Preis',
        defaultSnoozeDuration: '⏱️ Standard-Schlummerdauer',

        // Profile screen
        sleepyhead: 'Schlafmütze',
        member: 'PayToSnooze Mitglied',
        totalSpentOnSnoozing: 'Gesamt für Schlummern ausgegeben',
        spentALot: 'Das ist viel 💤! Versuch pünktlich aufzustehen!',
        stayedDisciplined: 'Gut gemacht, bleib diszipliniert!',
        snoozePrice: 'Schlummerpreis',
        snoozeDurationLabel: 'Schlummerdauer',
        aboutText: 'Der Wecker, der dich fürs Schlummern bezahlen lässt.\nKein „nur noch 5 Minuten" mehr!',
        version: 'Version 1.0.0',
        resetStatistics: 'Statistiken zurücksetzen',
        resetConfirm: 'Bist du sicher, dass du deine Statistiken zurücksetzen möchtest?',
        reset: 'Zurücksetzen',

        // Ringing screen
        payToSnooze: '💳 Bezahle zum Schlummern',
        snoozeMin: 'Schlummern {0} Min',
        imAwake: 'Ich bin wach!',
        free: 'Kostenlos',

        // Time Picker
        setTime: 'Zeit einstellen',
        hour: 'Stunde',
        minute: 'Minute',
        set: 'OK',
    },
};

export function getTranslations(lang: string): Record<string, string> {
    return translations[lang as Language] || translations.en;
}

export function getDayNames(lang: string): string[] {
    const t = getTranslations(lang);
    return [t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat];
}
