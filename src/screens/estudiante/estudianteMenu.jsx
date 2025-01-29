import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { EstudianteScreen } from './home';
import { NotasScreen } from './notas';
import { HorarioScreen } from './horario';
import { AsignacionesScreen } from './asignaciones';
import { GruposStack } from './gruposStack';
import CustomDrawerContent from '../../components/customDrawerContent';
import Icon from 'react-native-vector-icons/FontAwesome';

const Drawer = createDrawerNavigator();

export default function EstudianteMenu() {
    return (
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            drawerActiveTintColor: '#000',
            drawerInactiveTintColor: '#333',
            drawerLabelStyle: { fontSize: 16, fontWeight: 'bold' },
          }}
        >
            <Drawer.Screen name="Inicio" component={EstudianteScreen} options={{ drawerIcon: () => <Icon name="home" size={20} /> }} />
            <Drawer.Screen name="Grupos" component={GruposStack} options={{ drawerIcon: () => <Icon name="users" size={20} /> }} />
            <Drawer.Screen name="Asignaciones" component={AsignacionesScreen} options={{ drawerIcon: () => <Icon name="tasks" size={20} /> }} />
            <Drawer.Screen name="Notas" component={NotasScreen} options={{ drawerIcon: () => <Icon name="graduation-cap" size={20} /> }} />
            <Drawer.Screen name="Horario" component={HorarioScreen} options={{ drawerIcon: () => <Icon name="calendar" size={20} /> }} />
        </Drawer.Navigator>
      );
}

