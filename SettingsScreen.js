import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useAuth } from './AuthContext';

export default function SettingsScreen() {
  const { darkMode, updateDarkMode } = useAuth();

  const handleToggleDarkMode = (value) => {
    updateDarkMode(value);
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.row}>
        <Text style={[styles.text, darkMode ? styles.darkText : styles.lightText]}>
          Modo Escuro
        </Text>
        <Switch
          value={darkMode}
          onValueChange={handleToggleDarkMode}
          thumbColor={darkMode ? "#fff" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>

      <Text style={[styles.preview, darkMode ? styles.darkText : styles.lightText]}>
        {darkMode ? "🌙 Dark Mode Ativado" : "☀️ Light Mode Ativado"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
  },
  preview: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  lightBackground: { backgroundColor: '#fff' },
  darkBackground: { backgroundColor: '#021123' },
  lightText: { color: '#000' },
  darkText: { color: '#fff' },
});
