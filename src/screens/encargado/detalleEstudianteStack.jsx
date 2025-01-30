import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DetalleEstudianteScreen from './detalleEstudiante';
import MisEstudiantesScreen from './misEstudiantes';
import HorarioScreen from './horarioEstudiante';
import CursosEstudianteScreen from './cursosEstudiante';
import DetalleCursoScreen from './detalleCurso';
import AsignacionesScreen from './asignacionesCurso';
const Stack = createStackNavigator();

export function DetalleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EncargadoMain" component={MisEstudiantesScreen} />
        <Stack.Screen name="DetalleEstudiante" component={DetalleEstudianteScreen} />
        <Stack.Screen name="CursosEstudiante" component={CursosEstudianteScreen} />
        <Stack.Screen name="NotasEstudiante" component={MisEstudiantesScreen} />
        <Stack.Screen name="HorarioEstudiante" component={HorarioScreen} />
        <Stack.Screen name="DetalleCurso" component={DetalleCursoScreen} />
        <Stack.Screen name="AsignacionesEstudiante" component={AsignacionesScreen} />
    </Stack.Navigator>
  );
}
