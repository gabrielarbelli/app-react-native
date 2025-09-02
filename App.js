import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';

import { AuthProvider, useAuth } from './AuthContext';
import LoginScreen from './LoginScreen';
import MenuScreen from './MenuScreen';
import CalculatorScreen from './CalculatorScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#021123' }}>
        <ActivityIndicator size="large" color="#2879cf" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName={isAuthenticated ? "Menu" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="Calculator" component={CalculatorScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

