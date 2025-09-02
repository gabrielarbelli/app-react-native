import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAuth } from './AuthContext';

export default function MenuScreen({ navigation }) {
  const { logout, userData } = useAuth();
  const menuItems = [
    {
      title: 'Calculadora',
      description: 'Calculadora básica para operações matemáticas',
      color: '#4CAF50',
      onPress: () => navigation.navigate('Calculator'),
    },
    {
      title: 'Perfil',
      description: 'Ver e editar informações do perfil',
      color: '#2196F3',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      title: 'Configurações',
      description: 'Ajustar preferências da aplicação',
      color: '#FF9800',
      onPress: () => Alert.alert('Configurações', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Sobre',
      description: 'Informações sobre a aplicação',
      color: '#9C27B0',
      onPress: () => Alert.alert('Sobre', 'Aplicação React Native simples criada com Expo'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Terminar Sessão',
      'Tem a certeza que deseja terminar a sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim', onPress: () => logout() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu Principal</Text>
      </View>
      
      <Text style={styles.headerSubtitle}>
        Bem-vindo, {userData?.name || 'Usuário'}!
      </Text>

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { borderLeftColor: item.color }]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            </View>
            <View style={[styles.menuItemIcon, { backgroundColor: item.color }]}>
              <Text style={styles.menuItemIconText}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout} 
        activeOpacity={0.7}>
        <Text style={styles.logoutButtonText}>Terminar Sessão</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021123',
  },
  header: {
    backgroundColor: '#021123',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2879cf',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2879cf',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#2879cf',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 5,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF5722',
    marginHorizontal: 20,
    marginBottom: 70,
    paddingVertical: 15,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

