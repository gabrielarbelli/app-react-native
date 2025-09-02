import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');
  const { login } = useAuth();

  // Mostrar toast de logout quando chegar na tela
  useEffect(() => {
    // Verificar se veio de um logout
    const checkIfFromLogout = async () => {
      try {
        const wasLoggedOut = await AsyncStorage.getItem('wasLoggedOut');
        if (wasLoggedOut === 'true') {
          showToastMessage('Sessão terminada com sucesso!', 'error');
          await AsyncStorage.removeItem('wasLoggedOut');
        }
      } catch (error) {
        console.log('Erro ao verificar logout:', error);
      }
    };
    
    checkIfFromLogout();
  }, []);

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const result = await login(username, password);
    
    if (result.success) {
      // Login bem-sucedido - usuário será redirecionado automaticamente
      // Não exibir toast aqui pois será exibido no MenuScreen
    } else {
      Alert.alert('Erro', result.message);
    }
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
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome de utilizador"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Palavra-passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>Credenciais de teste:</Text>
          <Text style={styles.helpText}>Utilizador: admin</Text>
          <Text style={styles.helpText}>Palavra-passe: 123</Text>
        </View>
      </View>

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021123',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2879cf',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#2879cf',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: '#14448080',
    borderWidth: 2,
    borderColor: '#204b8f',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
    elevation: 3,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)'
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    }),
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpContainer: {
    marginTop: 40,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  helpText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
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

