import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Tabs } from 'expo-router'

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <MaterialIcons color={color} size={28} name="home" /> }} />
			<Tabs.Screen name="explore" options={{ tabBarIcon: ({ color }) => <MaterialIcons color={color} size={28} name="groups" /> }} />
		</Tabs>
	)
}
