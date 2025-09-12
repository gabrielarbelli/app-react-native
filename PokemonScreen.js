import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { colors } from './theme';
import { useAuth } from './AuthContext';
import DropDownPicker from 'react-native-dropdown-picker';

export default function PokemonScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode, updateDarkMode } = useAuth();

  // Estado para escolher a geração
  const [generation, setGeneration] = useState(1);
  const [open, setOpen] = useState(false);

  // Filtra pelo id
  const filteredPokemons = pokemons.filter(p => {
    if (generation === 1) return p.id >= 1 && p.id <= 151;
    if (generation === 2) return p.id >= 152 && p.id <= 251;
    if (generation === 3) return p.id >= 252 && p.id <= 386;
    if (generation === 4) return p.id >= 387 && p.id <= 493;
    if (generation === 5) return p.id >= 494 && p.id <= 649;
    if (generation === 6) return p.id >= 650 && p.id <= 721;
    if (generation === 7) return p.id >= 722 && p.id <= 809;
    if (generation === 8) return p.id >= 810 && p.id <= 898;
    if (generation === 9) return p.id >= 899 && p.id <= 1010;
    return true;
  });


  useEffect(() => {
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=1010')
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

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10, marginHorizontal: 15 }}>
        <DropDownPicker
          items={[
            { label: '1ª Geração', value: 1 },
            { label: '2ª Geração', value: 2 },
            { label: '3ª Geração', value: 3 },
            { label: '4ª Geração', value: 4 },
            { label: '5ª Geração', value: 5 },
            { label: '6ª Geração', value: 6 },
            { label: '7ª Geração', value: 7 },
            { label: '8ª Geração', value: 8 },
            { label: '9ª Geração', value: 9 },
          ]}
          open={open}
          setOpen={setOpen}
          value={generation}
          setValue={setGeneration}
          activeOpacity={0.7}
          style={{
            backgroundColor: darkMode ? colors.bgCardDark : colors.bgCardLight,
            borderColor: '#2879cf',
          }}
          labelStyle={{
            color: darkMode ? colors.textDark : colors.textLight,
          }}
        />
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
