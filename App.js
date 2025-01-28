import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/login/login'; // Pantalla de inicio de sesión
import StudentMenu from './src/screens/estudiante/estudianteMenu'; // Menú del estudiante
import EncargadoMenu from './src/screens/encargado/encargadoMenu'; // Menú del encargado
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const storedRole = await AsyncStorage.getItem('userRole');
      setRole(storedRole);
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="StudentDrawer" component={StudentMenu} />
        <Stack.Screen name="EncargadoDrawer" component={EncargadoMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
