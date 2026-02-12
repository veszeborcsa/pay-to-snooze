// Root layout - configures expo-router
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { requestNotificationPermissions } from '../services/notifications';
import { useAlarmChecker } from '../hooks/useAlarmChecker';
import { useTranslation } from '../hooks/useTranslation';
import { SettingsProvider } from '../context/SettingsContext';

function InnerLayout() {
  const router = useRouter();
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  useAlarmChecker();

  const { t } = useTranslation();

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#16213e',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: t.appTitle,
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <TouchableOpacity
                  onPress={() => router.push('/profile')}
                  style={{ padding: 8 }}
                >
                  <Text style={{ fontSize: 22 }}>😴</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/settings')}
                  style={{ padding: 8, marginRight: 4 }}
                >
                  <Text style={{ fontSize: 22 }}>⚙️</Text>
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="create"
          options={{
            title: t.createAlarm,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="edit"
          options={{
            title: t.editAlarm,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ringing"
          options={{
            title: '',
            headerShown: false,
            presentation: 'fullScreenModal',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: t.settings,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: t.profile,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <InnerLayout />
    </SettingsProvider>
  );
}
