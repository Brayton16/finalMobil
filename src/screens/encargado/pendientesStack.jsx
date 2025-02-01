import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PendientesGeneralesScreen from './asignacionesGenerales';
import DetalleAsignacionScreen from './detalleAsignacion';
const Stack = createStackNavigator();

export function PendientesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AsignacionesMain" component={PendientesGeneralesScreen} />
        <Stack.Screen name="DetalleAsignacion" component={DetalleAsignacionScreen} />
    </Stack.Navigator>
  );
}
