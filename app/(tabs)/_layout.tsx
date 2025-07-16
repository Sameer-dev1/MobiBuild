import { Tabs } from 'expo-router';
import { Chrome as Home, Wrench, Code, Smartphone, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1F2937',
          borderTopColor: '#374151',
          paddingBottom: 8,
          height: 65,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="builder"
        options={{
          title: 'Builder',
          tabBarIcon: ({ size, color }) => (
            <Wrench size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="code"
        options={{
          title: 'Code',
          tabBarIcon: ({ size, color }) => (
            <Code size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="preview"
        options={{
          title: 'Preview',
          tabBarIcon: ({ size, color }) => (
            <Smartphone size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}