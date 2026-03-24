import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "./theme";
import { useAuth } from "./AuthContext";
import { typeColors, typeIcons } from "./PokemonDetailsScreen";

const STORAGE_KEY = "tcgOwnedPokemonIds_v1";

function parsePokemonIdFromUrl(url) {
  const parts = String(url).split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  const id = Number(last);
  return Number.isFinite(id) ? id : null;
}

function spriteUrlForId(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function formatName(name) {
  if (!name) return "";
  return String(name).replace(/-/g, " ");
}

export default function PokemonTCGChecklistScreen({ navigation }) {
  const { darkMode } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [query, setQuery] = useState("");
  const [allPokemon, setAllPokemon] = useState([]); // { id, name, image }
  const [ownedIds, setOwnedIds] = useState(() => new Set());
  const [typesById, setTypesById] = useState({});
  const saveTimeoutRef = useRef(null);
  const loadingTypesRef = useRef(new Set());
  const typesByIdRef = useRef({});

  const bg = darkMode ? colors.darkBackground : colors.lightBackground;
  const cardBg = darkMode ? colors.bgCardDark : colors.bgCardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;

  const schedulePersistOwned = useCallback((nextSet) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const payload = JSON.stringify(Array.from(nextSet));
        await AsyncStorage.setItem(STORAGE_KEY, payload);
      } catch (e) {
        // Sem travar UI se storage falhar
        console.error("Erro ao salvar coleção TCG:", e);
      }
    }, 250);
  }, []);

  const toggleOwned = useCallback(
    (id) => {
      setOwnedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        schedulePersistOwned(next);
        return next;
      });
    },
    [schedulePersistOwned],
  );

  useEffect(() => {
    typesByIdRef.current = typesById;
  }, [typesById]);

  useEffect(() => {
    let mounted = true;

    async function loadOwnedFromStorage() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (!raw) return;
        const arr = JSON.parse(raw);
        if (Array.isArray(arr))
          setOwnedIds(
            new Set(arr.filter((n) => Number.isFinite(Number(n))).map(Number)),
          );
      } catch (e) {
        console.error("Erro ao carregar coleção TCG:", e);
      }
    }

    loadOwnedFromStorage();

    return () => {
      mounted = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadAllPokemon() {
      setLoading(true);
      setLoadingError("");
      try {
        const countRes = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=1",
        );
        const count = Number(countRes?.data?.count);
        const limit = Number.isFinite(count) && count > 0 ? count : 2000;

        const listRes = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
        );
        const results = Array.isArray(listRes?.data?.results)
          ? listRes.data.results
          : [];

        const parsed = results
          .map((p) => {
            const id = parsePokemonIdFromUrl(p?.url);
            if (!id) return null;
            return {
              id,
              name: p?.name || "",
              image: spriteUrlForId(id),
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.id - b.id);

        if (!mounted) return;
        setAllPokemon(parsed);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setLoadingError(
          "Não foi possível carregar a lista. Verifique sua internet e tente novamente.",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAllPokemon();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPokemon = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPokemon;

    const asNumber = Number(q);
    const isIdQuery = Number.isFinite(asNumber) && String(asNumber) === q;

    if (isIdQuery) {
      return allPokemon.filter((p) => p.id === asNumber);
    }

    return allPokemon.filter((p) => p.name.toLowerCase().includes(q));
  }, [allPokemon, query]);

  const ownedCount = useMemo(() => ownedIds.size, [ownedIds]);
  const totalCount = allPokemon.length;

  const percentComplete = useMemo(() => {
    if (totalCount <= 0) return "0";
    const raw = (ownedCount / totalCount) * 100;
    const truncated = Math.trunc(raw * 1000) / 1000;
    return String(truncated).replace(/\.?0+$/, "");
  }, [ownedCount, totalCount]);

  const loadTypesForId = useCallback(async (id) => {
    if (!id) return;
    if (typesByIdRef.current[id]) return;
    if (loadingTypesRef.current.has(id)) return;

    loadingTypesRef.current.add(id);
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const rawTypes = Array.isArray(res?.data?.types) ? res.data.types : [];
      const parsedTypes = rawTypes.map((t) => t?.type?.name).filter(Boolean);

      setTypesById((prev) => ({
        ...prev,
        [id]: parsedTypes,
      }));
    } catch (e) {
      console.error(`Erro ao carregar tipos do pokemon ${id}:`, e);
    } finally {
      loadingTypesRef.current.delete(id);
    }
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    viewableItems.forEach((entry) => {
      const id = entry?.item?.id;
      if (id) loadTypesForId(id);
    });
  });

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: textColor }]}>
          Carregando lista completa…
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Coleção TCG</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.topInfo}>
        <Text style={[styles.counterText, { color: textColor }]}>
          Marcados: <Text style={styles.counterStrong}>{ownedCount}</Text> /{" "}
          {totalCount}{" "}
          <Text style={{ fontWeight: "700", color: colors.primary }}>
            ({percentComplete}%)
          </Text>
        </Text>
      </View>

      <View
        style={[
          styles.searchBox,
          { backgroundColor: cardBg, borderColor: colors.primary },
        ]}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por nome ou # (ex: pikachu / 25)"
          placeholderTextColor={
            darkMode ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.5)"
          }
          style={[styles.searchInput, { color: textColor }]}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {loadingError ? (
        <View
          style={[
            styles.errorBox,
            { backgroundColor: cardBg, borderColor: colors.primary },
          ]}
        >
          <Text style={[styles.errorText, { color: textColor }]}>
            {loadingError}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.replace("PokemonTCGChecklist")}
            style={styles.retryBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={filteredPokemon}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 35 }}
        renderItem={({ item }) => {
          const checked = ownedIds.has(item.id);
          const itemTypes = typesById[item.id] || [];
          return (
            <TouchableOpacity
              onPress={() => toggleOwned(item.id)}
              activeOpacity={0.7}
              style={[
                styles.row,
                { backgroundColor: cardBg, borderColor: colors.primary },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.avatar} />

              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: textColor }]}>
                  #{item.id} {formatName(item.name)}
                </Text>
                <View style={styles.typeRow}>
                  {itemTypes.map((typeName) => (
                    <View
                      key={`${item.id}-${typeName}`}
                      style={[
                        styles.typeCard,
                        { backgroundColor: typeColors[typeName] || "#777" },
                      ]}
                    >
                      {typeIcons[typeName] ? (
                        <Image
                          source={typeIcons[typeName]}
                          style={styles.typeIcon}
                        />
                      ) : null}
                      <Text style={styles.typeText}>
                        {String(typeName).toUpperCase()}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View
                style={[
                  styles.checkbox,
                  checked ? styles.checkboxOn : styles.checkboxOff,
                ]}
              >
                <Text style={styles.checkboxText}>{checked ? "✓" : ""}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontWeight: "600",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {},
  topInfo: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  counterText: {
    fontWeight: "600",
  },
  counterStrong: {
    fontWeight: "900",
    color: colors.primary,
  },
  searchBox: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  avatar: {
    width: 42,
    height: 42,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    flexWrap: "wrap",
  },
  typeCard: {
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 5,
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  typeIcon: {
    width: 14,
    height: 14,
    marginRight: 2,
  },
  typeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxOn: {
    backgroundColor: colors.primary,
  },
  checkboxOff: {
    backgroundColor: "transparent",
  },
  checkboxText: {
    color: "#fff",
    fontWeight: "900",
  },
  errorBox: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: {
    fontWeight: "700",
  },
  retryBtn: {
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
  },
});
