# ⏰ PayToSnooze

**The alarm clock that makes you pay to snooze.** No more "just 5 more minutes"!

## 💡 What is it?

PayToSnooze is a mobile alarm clock app where every snooze costs you real money. Set a price per snooze (minimum $1.00), and think twice before hitting that button.

## ✨ Features

- **Create & manage alarms** — Set time, label, repeat days, and snooze duration
- **Custom snooze pricing** — Set how much each snooze costs (minimum $1.00)
- **Full-screen ringing** — Pulsing alarm screen with dismiss and pay-to-snooze options
- **Snooze spending tracker** — See how much you've spent on snoozing in Settings
- **Web & mobile support** — Works in the browser and on iOS/Android

## 🛠️ Tech Stack

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/) for file-based navigation
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for local data persistence
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) for native alarm triggers
- Custom web alarm checker for browser support

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

```bash
git clone https://github.com/veszeborcsa/pay-to-snooze.git
cd pay-to-snooze
npm install
```

### Run the app

```bash
# Web
npx expo start --web

# iOS
npx expo start --ios

# Android
npx expo start --android
```

## 📱 Screenshots

*Coming soon*

## 🗺️ Roadmap

- [ ] Real payment integration (Stripe / Apple Pay / Google Pay)
- [ ] Sound customization
- [ ] Alarm statistics & analytics
- [ ] Social challenges (compete with friends)

## 📄 License

MIT
