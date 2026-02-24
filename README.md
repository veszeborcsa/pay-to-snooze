# ⏰ PayToSnooze

**An alarm clock that hits you where it hurts — your wallet.**

We've all been there. The alarm goes off, you tell yourself "just 5 more minutes," and suddenly it's an hour later and you're late for everything. PayToSnooze fixes that by attaching a real price tag to every single snooze. Want to sleep in? Sure — but it'll cost you.

---

## 💡 The Idea

It's simple: set an alarm, set a snooze price (minimum $1), and now every time you reach for that snooze button, you're spending real money. Turns out, waking up is a lot easier when your bank account is on the line.

The app tracks how much you've spent on snoozing over time, so you can look back and either feel proud of yourself — or horrified.

## ✨ What You Get

### 🔔 Alarms That Actually Work
Create alarms with custom labels, pick which days they repeat, and choose how long each snooze lasts. Everything you'd expect from an alarm clock, done right.

### 💸 Pay-to-Snooze
The core feature. Set a price per snooze (starting at $1.00) and watch how fast you learn to wake up on the first ring. Your total snooze spending is tracked in Settings so you can confront your habits.

### 🔊 Custom Alarm Sounds
Pick from 5 built-in tones (Classic, Gentle, Urgent, Digital, Bells) or **upload your own audio files** — your favorite song, a motivational speech, whatever gets you out of bed. Set a default in Settings or pick per-alarm.

### 🎨 Themes
Four color themes to match your vibe: **Midnight** (dark blue), **Ocean** (teal), **Forest** (green), and **Sunset** (warm orange). Switch anytime in Settings.

### 🌍 Multi-Language
Full support for **English**, **Hungarian**, **Spanish**, and **German**. Every screen, every button, every label — properly translated, not just thrown through Google Translate.

### 👤 User Profile
Set your username and email in the profile screen. Simple, no-nonsense.

### 📳 Full-Screen Ringing
When the alarm goes off, you get a full-screen pulsing animation with vibration and your chosen alarm sound. Two buttons: **Dismiss** (free) or **Snooze** (costs you money). No hiding from it.

---

## 🛠️ Built With

- **[React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)** — cross-platform mobile framework
- **[Expo Router](https://docs.expo.dev/router/introduction/)** — file-based navigation (like Next.js but for mobile)
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** — local data persistence (alarms, settings, custom sounds)
- **[Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)** — native alarm scheduling on iOS/Android
- **Web Audio API** — synthesized alarm tones + custom audio playback in the browser
- **Custom web alarm checker** — background polling for alarms when running in the browser

## 📁 Project Structure

```
pay-to-snooze/
├── app/               # Screens (index, create, edit, settings, ringing, profile)
├── components/        # Reusable UI (TimePicker, SoundPicker)
├── context/           # React context (SettingsContext)
├── hooks/             # Custom hooks (useAlarms, useTranslation, useTheme)
├── i18n/              # Translations (EN, HU, ES, DE)
├── services/          # Sound service, notification service
├── store/             # Data layer (alarmStore with AsyncStorage)
├── theme/             # Color theme definitions
└── __tests__/         # Jest test suite
```

## 🚀 Getting Started

### What You Need

- [Node.js](https://nodejs.org/) v18 or newer
- That's basically it — Expo handles the rest

### Setup

```bash
git clone https://github.com/veszeborcsa/pay-to-snooze.git
cd pay-to-snooze
npm install
```

### Running It

```bash
# In the browser (quickest way to try it)
npx expo start --web

# On your iPhone
npx expo start --ios

# On your Android phone
npx expo start --android
```

### Running Tests

```bash
npx jest
```

There's a full test suite covering the alarm store, settings, notifications, and UI components.

---

## 🗺️ What's Next

- [ ] **Real payment integration** — Stripe, Apple Pay, Google Pay (the whole point, really)
- [ ] **Alarm statistics & analytics** — charts showing your snooze habits over time
- [ ] **Social challenges** — compete with friends to see who snoozes less
- [ ] **Charity mode** — snooze money goes to a cause you care about

## 🤝 Contributing

If you want to contribute, just fork the repo and open a PR. There are no strict rules — just keep it clean and test your changes.

## 📄 License

MIT — do whatever you want with it.
