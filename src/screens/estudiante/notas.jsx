import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function NotasScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Notas</Text>
      <Text>Bienvenido al menú de notas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
