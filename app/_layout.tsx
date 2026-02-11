// Root layout - configures expo-router
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { requestNotificationPermissions } from '../services/notifications';
import { useAlarmChecker } from '../hooks/useAlarmChecker';

export default function RootLayout() {
  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermissions();
  }, []);

  // Check alarms periodically on web (no-op on native)
  useAlarmChecker();

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
            title: 'PayToSnooze',
          }}
        />
        <Stack.Screen
          name="create"
          options={{
            title: 'New Alarm',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="edit"
          options={{
            title: 'Edit Alarm',
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
            title: 'Settings',
          }}
        />
      </Stack>
    </>
  );
}
