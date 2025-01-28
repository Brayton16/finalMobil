import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor ingresa el correo y la contraseña.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener el rol del usuario desde los claims de Firebase
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role;

      // Validar roles permitidos
      if (role === 'estudiante' || role === 'encargado') {
        // Guardar el rol en AsyncStorage
        await AsyncStorage.setItem('userRole', role);
        await AsyncStorage.setItem('userId', user.uid);

        // Redirigir según el rol
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: role === 'estudiante' ? 'StudentDrawer' : 'EncargadoDrawer' }],
          })
        );
      } else {
        Alert.alert('Acceso denegado', 'Tu rol no está autorizado para usar esta aplicación.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    maxWidth: 400,
    padding: 12,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});
