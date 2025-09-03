import React, { useState, useEffect } from 'react';
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
  const { darkMode, updateDarkMode } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Mostrar toast de boas-vindas quando chegar na tela
  useEffect(() => {
    setTimeout(() => {
      showToastMessage('Login realizado com sucesso!', 'success');
    }, 500);
  }, []);

  const menuItems = [
    {
      title: 'Calculadora',
      description: 'Calculadora básica',
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
      title: 'Galeria',
      description: 'Fotos e imagens da galeria',
      color: '#f32123',
      onPress: () => navigation.navigate('Gallery'),
    },
    {
      title: 'Pokedéx',
      description: 'API pública de pokémons',
      color: '#9C27B0',
      onPress: () => navigation.navigate('Pokemon'),
    },
    {
      title: 'Configurações',
      description: 'Ajustar preferências da aplicação',
      color: '#FF9800',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      title: 'Sobre',
      description: 'Informações sobre a aplicação',
      color: '#959595',
      onPress: () => Alert.alert('Sobre', 'Aplicação React Native criada com Expo, Versão 1.0.0'),
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

  // Função para mostrar toast
  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // Auto-hide após 3 segundos
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <SafeAreaView style={[styles.container, darkMode ? styles.darkBackground : styles.lightBackground]}>
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
            style={[
              styles.menuItem, 
              { borderLeftColor: item.color },
              index === menuItems.length - 1 && styles.lastMenuItem
            ]}
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

      {/* Toast de Notificação */}
      {showToast && (
        <View style={styles.toastContainer}>
          <View style={[
            styles.toastContent,
            toastType === 'success' ? styles.toastSuccess : styles.toastError
          ]}>
            <Text style={styles.toastText}>
              {toastType === 'success' ? '✓ ' : '✗ '}
              {toastMessage}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lightBackground: { backgroundColor: '#fff' },
  darkBackground: { backgroundColor: '#021123' },
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
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 5,
  },
  lastMenuItem: {
    marginBottom: 40, 
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

  // Estilos do Toast
  toastContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    left: 20,
    zIndex: 1000,
  },
  toastContent: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastSuccess: {
    backgroundColor: '#4CAF50',
  },
  toastError: {
    backgroundColor: '#F44336',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

