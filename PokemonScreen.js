import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function PokemonScreen() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then(async response => {
        const results = await Promise.all(
          response.data.results.map(async (poke) => {
            const details = await axios.get(poke.url);
            return {
              name: poke.name,
              image: details.data.sprites.front_default,
              type: details.data.types.map(t => t.type.name).join(', ')
            };
          })
        );
        setPokemons(results);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E3350D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pokedéx</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={pokemons}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name.toUpperCase()}</Text>
            <Text style={styles.type}>Tipo: {item.type}</Text>
          </View>
        )}
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
  card: { 
    flex: 1,
    margin: 8, 
    backgroundColor: '#1a3a5a', 
    borderRadius: 10, 
    padding: 10, 
    elevation: 2,
    borderWidth: 1,
    borderColor: '#2879cf',
    alignItems: 'center',
  }, 
  listContainer: {
    padding: 8,
  },
  image: { width: 80, height: 80 },
  name: { marginTop: 5, fontWeight: 'bold', fontSize: 16, color: '#E3350D' },
  type: { fontSize: 14, color: '#fff' },
});
