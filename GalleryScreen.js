import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from './AuthContext';
import { colors } from './theme';

export default function GalleryScreen({ navigation }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode, updateDarkMode } = useAuth();

  useEffect(() => {
    // Usando API gratuita de imagens aleatórias
    const data = Array.from({ length: 10 }).map((_, index) => ({
      id: index.toString(),
      url: `https://picsum.photos/400/300?random=${index + 1}`,
      author: `Autor ${index + 1}`
    }));
    setPhotos(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? colors.darkBackground : colors.lightBackground }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Galeria</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={photos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: darkMode ? colors.bgCardDark : colors.bgCardLight }]}>
            <Image source={{ uri: item.url }} style={styles.image} />
            <Text style={[styles.author, { color: darkMode ? colors.textDark : colors.textLight }]}>{item.author}</Text>
          </View>
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021123',
    marginBottom: 50,
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#021123',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2879cf',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2879cf',
  },
  backButton: {
  },
  backButtonText: {
    color: '#2879cf',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 8,
  },
  card: { 
    flex: 1,
    margin: 8, 
    borderRadius: 10, 
    padding: 10, 
    borderWidth: 1,
    borderColor: '#2879cf',
  }, 
  image: { 
    width: '100%', 
    height: 150, 
    borderRadius: 10,
    marginBottom: 8,
  }, 
  author: { 
    marginTop: 5, 
    fontWeight: 'bold', 
    textAlign: 'center',
    fontSize: 12,
  },
});
