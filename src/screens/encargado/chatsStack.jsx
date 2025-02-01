import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './chatScreen';
import ChatsScreen from './chatsScreen';
const Stack = createStackNavigator();

export function ChatsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ChatsMain" component={ChatsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
