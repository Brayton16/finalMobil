import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../../components/customDrawerContent';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Drawer = createDrawerNavigator();

const ScreenComponent = ({ title }) => (
  <View style={styles.screen}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

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
      <Drawer.Screen name="Grupos" component={() => <ScreenComponent title="Grupos Supervisados" />} options={{ drawerIcon: () => <Icon name="users" size={20} /> }} />
      <Drawer.Screen name="Asignaciones" component={() => <ScreenComponent title="Asignaciones Supervisadas" />} options={{ drawerIcon: () => <Icon name="tasks" size={20} /> }} />
      <Drawer.Screen name="Notas" component={() => <ScreenComponent title="Notas de Estudiantes" />} options={{ drawerIcon: () => <Icon name="graduation-cap" size={20} /> }} />
      <Drawer.Screen name="Horario" component={() => <ScreenComponent title="Horario de Supervisados" />} options={{ drawerIcon: () => <Icon name="calendar" size={20} /> }} />
      <Drawer.Screen name="Chats (Beta)" component={() => <ScreenComponent title="Chats (Beta)" />} options={{ drawerIcon: () => <Icon name="comments" size={20} /> }} />
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
