import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotasGeneralesScreen from './notasGenerales';
import DetalleAsignacionScreen from './detalleAsignacion';
const Stack = createStackNavigator();

export function NotasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="NotasMain" component={NotasGeneralesScreen} />
        <Stack.Screen name="DetalleAsignacion" component={DetalleAsignacionScreen} />
    </Stack.Navigator>
  );
}
