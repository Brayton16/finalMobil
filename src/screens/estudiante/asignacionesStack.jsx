import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsignacionesScreen from './asignaciones';
import DetalleAsignacionScreen from './detalleAsignacion';
const Stack = createStackNavigator();

export function AsignacionesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AsignacionesMain" component={AsignacionesScreen} />
      <Stack.Screen name="DetalleAsignacion" component={DetalleAsignacionScreen} />
    </Stack.Navigator>
  );
}
