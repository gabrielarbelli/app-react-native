// PokemonDetailsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { colors } from './theme';

export default function PokemonDetailsScreen({ route, navigation }) {
  const { pokemon } = route.params; // Pokémon completo já recebido
  const { darkMode } = useAuth();
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // busca a chain de evolução
    if (pokemon.species?.url) {
      axios.get(pokemon.species.url)
        .then(speciesRes => {
          const evoUrl = speciesRes.data.evolution_chain.url;
          return axios.get(evoUrl);
        })
        .then(evoRes => {
          const chain = [];
          let evoData = evoRes.data.chain;

          do {
            chain.push({
              name: evoData.species.name,
              url: evoData.species.url
            });
            evoData = evoData.evolves_to[0];
          } while (evoData && evoData.hasOwnProperty('evolves_to'));

          // buscar as imagens de cada evolução
          Promise.all(
            chain.map(async evo => {
              const pokeRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evo.name}`);
              return {
                name: evo.name,
                image: pokeRes.data.sprites?.other?.['official-artwork']?.front_default || pokeRes.data.sprites.front_default
              };
            })
          ).then(setEvolutionChain)
           .finally(() => setLoading(false));
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: darkMode ? colors.darkBackground : colors.lightBackground }]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  // agrupar stats em pares para 2 colunas
  const stats = pokemon?.stats || [];
  const groupedStats = [];
  for (let i = 0; i < stats.length; i += 2) {
    groupedStats.push(stats.slice(i, i + 2));
  }

  const imageUri =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.image;
  const typeText = pokemon.types?.map(t => t.type.name).join(', ') || 'Desconhecido';

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: darkMode ? colors.darkBackground : colors.lightBackground },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: darkMode ? colors.bgCardDark : colors.bgCardLight }]}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        <Text style={styles.name}>{pokemon?.name?.toUpperCase() || 'Desconhecido'}</Text>
          
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Text style={{ color: darkMode ? colors.textDark : colors.textLight, fontWeight: 'bold', marginRight: 5 }}>
            Tipo:
          </Text>
          {pokemon.types.map((t, i) => (
            <View 
              key={i} 
              style={[
                styles.typeCard,
                {backgroundColor: typeColors[t.type.name]}
              ]}
            >
              <Image 
                source={typeIcons[t.type.name]}
                style={{ width: 16, height: 16, marginRight: 2 }} 
              />
              <Text style={{ color: '#fff', fontSize: 12 }}>{t.type.name.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.info, { color: darkMode ? colors.textDark : colors.textLight }]}>
          Altura: {pokemon?.height ? pokemon.height / 10 : 'N/A'} m
        </Text>
        <Text style={[styles.info, { color: darkMode ? colors.textDark : colors.textLight }]}>
          Peso: {pokemon?.weight ? pokemon.weight / 10 : 'N/A'} kg
        </Text>

        <Text style={[styles.sectionTitle, { color: darkMode ? colors.textDark : colors.textLight }]}>
          Status Base
        </Text>

        {groupedStats.map((pair, rowIndex) => (
          <View key={rowIndex} style={styles.statsRow}>
            {pair.map((stat, colIndex) => {
              const percent = Math.min((stat.base_stat / 150) * 100, 100);
              return (
                <View
                  key={colIndex}
                  style={[styles.statContainer, colIndex === 0 ? { marginRight: 10 } : {}]}
                >
                  <Text style={[styles.infoBase, { color: darkMode ? colors.textDark : colors.textLight }]}>
                    {stat.stat.name.toUpperCase()}: {stat.base_stat}
                  </Text>
                  <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: '#E3350D' }]} />
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {evolutionChain.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: darkMode ? colors.textDark : colors.textLight }]}>
              Evolução
            </Text>
            <View style={styles.evolutionRow}>
              {evolutionChain.map((evo, index) => (
                <View key={index} style={styles.evoContainer}>
                  <View style={styles.evoCard}>
                    <Image source={{ uri: evo.image }} style={styles.evoImage} />
                    <Text style={[styles.evoName, { color: darkMode ? colors.textDark : colors.textLight }]}>
                      {evo.name.toUpperCase()}
                    </Text>
                  </View>
                  {index < evolutionChain.length - 1 && (
                    <Text style={[styles.evoArrow, { color: darkMode ? colors.textDark : colors.textLight }]}>
                      →
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  backButtonText: {
    color: '#2879cf',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    margin: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2879cf',
    alignItems: 'center',
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 22,
    color: '#E3350D',
  },
  type: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    marginTop: 4,
    fontSize: 14,
  },
  infoBase: {
    marginTop: 5,
    fontSize: 12,
  },
  sectionTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  statContainer: {
    flex: 0.48,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    overflow: 'hidden',
    marginTop: 2,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  evolutionRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  evoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  evoCard: {
    alignItems: 'center',
    marginRight: 5,
  },
  evoImage: {
    width: 60,
    height: 60,
  },
  evoName: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  evoArrow: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  typeCard: {
    borderRadius: 6, 
    paddingHorizontal: 5, 
    paddingVertical: 2, 
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export const typeIcons = {
  bug: require('./assets/bug.png'),
  dark: require('./assets/dark.png'),
  dragon: require('./assets/dragon.png'),
  electric: require('./assets/electric.png'),
  fairy: require('./assets/fairy.png'),
  fighting: require('./assets/fighting.png'),
  fire: require('./assets/fire.png'),
  flying: require('./assets/flying.png'),
  ghost: require('./assets/ghost.png'),
  grass: require('./assets/grass.png'),
  ground: require('./assets/ground.png'),
  ice: require('./assets/ice.png'),
  normal: require('./assets/normal.png'),
  poison: require('./assets/poison.png'),
  psychic: require('./assets/psychic.png'),
  rock: require('./assets/rock.png'),
  steel: require('./assets/steel.png'),
  water: require('./assets/water.png'),
};

export const typeColors = {
  bug: '#A6B91A',
  dark: '#705746',
  dragon: '#0761af',
  electric: '#F7D02C',
  fairy: '#D685AD',
  fighting: '#C22E28',
  fire: '#EE8130',
  flying: '#799de7',
  ghost: '#735797',
  grass: '#7AC74C',
  ground: '#E2BF65',
  ice: '#96D9D6',
  normal: '#9fa8b1',
  poison: '#A33EA1',
  psychic: '#F95587',
  rock: '#B6A136',
  steel: '#B7B7CE',
  water: '#6390F0',
};
