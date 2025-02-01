import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DetalleEstudianteScreen from './detalleEstudiante';
import MisEstudiantesScreen from './misEstudiantes';
import HorarioScreen from './horarioEstudiante';
import CursosEstudianteScreen from './cursosEstudiante';
import DetalleCursoScreen from './detalleCurso';
import AsignacionesScreen from './asignacionesCurso';
import DetalleAsignacionScreen from './detalleAsignacion';
import NotasEstudianteScreen from './notasEstudianteCurso';
import ChatProfesorScreen from './chatScreen';
const Stack = createStackNavigator();

export function DetalleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EncargadoMain" component={MisEstudiantesScreen} />
        <Stack.Screen name="DetalleEstudiante" component={DetalleEstudianteScreen} />
        <Stack.Screen name="CursosEstudiante" component={CursosEstudianteScreen} />
        <Stack.Screen name="HorarioEstudiante" component={HorarioScreen} />
        <Stack.Screen name="DetalleCurso" component={DetalleCursoScreen} />
        <Stack.Screen name="ChatProfesor" component={ChatProfesorScreen} />
        <Stack.Screen name="AsignacionesEstudiante" component={AsignacionesScreen} />
        <Stack.Screen name="DetalleAsignacion" component={DetalleAsignacionScreen} />
        <Stack.Screen name="NotasEstudianteCurso" component={NotasEstudianteScreen} />
    </Stack.Navigator>
  );
}
