import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GruposScreen from './grupos';
import CursosScreen from './cursos'; // ✅ Importamos Cursos
import ListaEstudiantesScreen from './ListaEstudiantes'; // ✅ Importamos Secciones
import CursosOpciones from './cursosOpciones';
import CursosAnunciosScreen from './anuncioCurso';
import CursosNotas from './notasCurso';
import DetalleAsignacionScreen from './detalleAsignacion';
import AsignacionesCursoScreen from './asignacionCurso';
const Stack = createStackNavigator();

export function GruposStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GruposMain" component={GruposScreen} />
      <Stack.Screen name="Cursos" component={CursosScreen} />
      <Stack.Screen name="ListaEstudiantes" component={ListaEstudiantesScreen} />
      <Stack.Screen name="CursosOpciones" component={CursosOpciones} />
      <Stack.Screen name="CursosAnuncios" component={CursosAnunciosScreen} />
      <Stack.Screen name="CursosNotas" component={CursosNotas} />
      <Stack.Screen name="CursosAsignaciones" component={AsignacionesCursoScreen} />
      <Stack.Screen name="DetalleAsignacion" component={DetalleAsignacionScreen} />
    </Stack.Navigator>
  );
}
