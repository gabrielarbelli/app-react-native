import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { colors } from './theme';
import { useAuth } from './AuthContext';

export default function PokemonScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode, updateDarkMode } = useAuth();

  // Estado para escolher a geração
  const [generation, setGeneration] = useState(1); // 1 ou 2

  // Filtra pelo id
  const filteredPokemons = pokemons.filter(p => {
    if (generation === 1) return p.id <= 151; // IDs da 1ª geração
    if (generation === 2) return p.id >= 152 && p.id <= 251; // IDs da 2ª geração
    if (generation === 3) return p.id >= 252 && p.id <= 386; // IDs da 3ª geração
    if (generation === 4) return p.id >= 387 && p.id <= 493; // IDs da 4ª geração
    return true;
  });

  useEffect(() => {
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=493')
      .then(async response => {
        const results = await Promise.all(
        response.data.results.map(async (poke) => {
          const details = await axios.get(poke.url);
          return {
            ...details.data, // pega TODOS os dados da API
            name: poke.name, // mantém o nome
            image: details.data.sprites.front_default, // mantém a imagem "simples"
            type: details.data.types.map(t => t.type.name).join(', '), // mantém o type
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
      <View style={[styles.center, { backgroundColor: darkMode ? colors.darkBackground : colors.lightBackground }]}>
        <ActivityIndicator size="large" color="#2196F3" />
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

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
        <TouchableOpacity
          style={[styles.genButton, generation === 1 && styles.genButtonActive]}
          activeOpacity={0.7}
          onPress={() => setGeneration(1)}
        >
          <Text style={styles.genButtonText}>1ª Geração</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genButton, generation === 2 && styles.genButtonActive]}
          activeOpacity={0.7}
          onPress={() => setGeneration(2)}
        >
          <Text style={styles.genButtonText}>2ª Geração</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genButton, generation === 3 && styles.genButtonActive]}
          activeOpacity={0.7}
          onPress={() => setGeneration(3)}
        >
          <Text style={styles.genButtonText}>3ª Geração</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genButton, generation === 4 && styles.genButtonActive]}
          activeOpacity={0.7}
          onPress={() => setGeneration(4)}
        >
          <Text style={styles.genButtonText}>4ª Geração</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredPokemons}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: darkMode ? colors.bgCardDark : colors.bgCardLight }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PokemonDetails', { pokemon: item })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name.toUpperCase()}</Text>
            <Text style={[styles.type, { color: darkMode ? colors.textDark : colors.textLight }]}>Tipo: {item.type}</Text>
          </TouchableOpacity>
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
  name: { fontSize: 16, fontWeight: 'bold', color: '#E3350D' },
  type: { fontSize: 14, fontWeight: 'bold' },
  genButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2879cf',
  },
  genButtonActive: {
    backgroundColor: '#2879cf',
  },
  genButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

});
