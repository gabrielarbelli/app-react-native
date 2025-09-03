import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function GalleryScreen({ navigation }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <View style={styles.container}>
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
          <View style={styles.card}>
            <Image source={{ uri: item.url }} style={styles.image} />
            <Text style={styles.author}>{item.author}</Text>
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
    backgroundColor: '#021123',
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
    backgroundColor: '#1a3a5a', 
    borderRadius: 10, 
    padding: 10, 
    elevation: 2,
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
    color: '#fff',
    fontSize: 12,
  },
});
