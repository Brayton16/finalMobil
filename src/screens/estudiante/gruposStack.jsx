import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GruposScreen from './grupos';
import CursosScreen from './cursos'; // ✅ Importamos Cursos
import ListaEstudiantesScreen from './ListaEstudiantes'; // ✅ Importamos Secciones

const Stack = createStackNavigator();

export function GruposStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GruposMain" component={GruposScreen} />
      <Stack.Screen name="Cursos" component={CursosScreen} />
      <Stack.Screen name="ListaEstudiantes" component={ListaEstudiantesScreen} />
    </Stack.Navigator>
  );
}
