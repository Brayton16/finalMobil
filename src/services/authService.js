// /src/services/authService.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

export const handleEmailRegister = async (email, password, confirmPassword, setUser, setError) => {
  if (password !== confirmPassword) {
    setError('passwordMismatch');
    return;
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    setError(null);
  } catch (error) {
    console.error('Registration error: ', error.message); // Agregar console.error
    setError('registerError');
  }
};

export const handleEmailLogin = async (email, password, setUser, setError) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    setError(null);
  } catch (error) {
    console.error('Login error: ', error.message); // Agregar console.error
    setError('loginError');
  }
};

export const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log('Sesión cerrada correctamente');
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
    throw error;
  }
};
