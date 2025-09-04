import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { colors } from './theme';
import { useAuth } from './AuthContext';

export default function PokemonScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode, updateDarkMode } = useAuth();

  useEffect(() => {
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then(async response => {
        const results = await Promise.all(
          response.data.results.map(async (poke) => {
            const details = await axios.get(poke.url);
            console.log(details);
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
    <View style={[styles.container, { backgroundColor: darkMode ? colors.darkBackground : colors.lightBackground }]}>
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
          <View style={[styles.card, { backgroundColor: darkMode ? colors.bgCardDark : colors.bgCardLight }]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name.toUpperCase()}</Text>
            <Text style={[styles.type, { color: darkMode ? colors.textDark : colors.textLight }]}>Tipo: {item.type}</Text>
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
  card: { 
    flex: 1,
    margin: 8, 
    borderRadius: 10, 
    padding: 10, 
    borderWidth: 1,
    borderColor: '#2879cf',
    alignItems: 'center',
  }, 
  listContainer: {
    padding: 8,
  },
  image: { width: 80, height: 80 },
  name: { marginTop: 5, fontWeight: 'bold', fontSize: 16, color: '#E3350D' },
  type: { fontSize: 14, fontWeight: 'bold' },
});
