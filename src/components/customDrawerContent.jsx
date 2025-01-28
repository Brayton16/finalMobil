import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { CommonActions } from '@react-navigation/native';

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Cerrar sesión en Firebase
      await signOut(auth);
      // Redirigir a la pantalla de Login
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }], // Asegúrate de que "Login" está registrado en el Stack.Navigator
        })
      );
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      {/* Logo en la parte superior */}
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>

      {/* Lista de opciones del menú */}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Botón de Logout en la parte inferior */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#fff" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    margin: 20,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
