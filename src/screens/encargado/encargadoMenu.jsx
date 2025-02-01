import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../../components/customDrawerContent';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DetalleStack } from './detalleEstudianteStack';
import { EncargadoInicioScreen } from './home'
import { PendientesStack } from './pendientesStack';
import { NotasStack } from './notasStack';
import { ChatsStack } from './chatsStack';
import AnunciosScreen from './anunciosGeneral';
const Drawer = createDrawerNavigator();

export default function EncargadoMenu() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: { fontSize: 16, fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen 
        name="Inicio"
        component={EncargadoInicioScreen}
        options={{ drawerIcon: () => <Icon name="home" size={20} /> }}
      />
      <Drawer.Screen 
        name="Mis Estudiantes" 
        component={DetalleStack} 
        options={{ drawerIcon: () => <Icon name='users' size={20}/>}} 
      />
      {/* <Drawer.Screen 
        name="Grupos" 
        component={() => <ScreenComponent title="Grupos Supervisados" />} 
        options={{ drawerIcon: () => <Icon name="users" size={20} /> }} 
      /> */}
      <Drawer.Screen 
        name="Asignaciones" 
        component={PendientesStack} 
        options={{ drawerIcon: () => <Icon name="tasks" size={20} /> }} 
      />
      <Drawer.Screen 
        name="Notas" 
        component={NotasStack} 
        options={{ drawerIcon: () => <Icon name="graduation-cap" size={20} /> }} 
      />
      <Drawer.Screen 
        name="Anuncios" 
        component={AnunciosScreen} 
        options={{ drawerIcon: () => <Icon name="bullhorn" size={20} /> }} 
      />
      <Drawer.Screen 
        name="Chats" 
        component={ChatsStack} 
        options={{ drawerIcon: () => <Icon name="comments" size={20} /> }} 
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
