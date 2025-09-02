import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function ProfileScreen({ navigation }) {
  const profileData = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+351 912 345 678',
    location: 'Lisboa, Portugal',
    joinDate: 'Janeiro 2024',
    bio: 'Desenvolvedor apaixonado por tecnologia e inovação. Sempre em busca de novos desafios e aprendizados.',
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' }}
            style={styles.avatar}
          />
          <View style={styles.onlineIndicator} />
        </View>
        
        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.email}>{profileData.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Telefone</Text>
          <Text style={styles.infoValue}>{profileData.phone}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Localização</Text>
          <Text style={styles.infoValue}>{profileData.location}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Membro desde</Text>
          <Text style={styles.infoValue}>{profileData.joinDate}</Text>
        </View>
      </View>

      <View style={styles.bioSection}>
        <Text style={styles.bioLabel}>Sobre mim</Text>
        <Text style={styles.bioText}>{profileData.bio}</Text>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButtonSecondary} activeOpacity={0.7}>
          <Text style={styles.actionButtonTextSecondary}>Alterar Foto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021123',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#021123',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2879cf',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
  },
  backButtonText: {
    color: '#2879cf',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2879cf',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#1a3a5a',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#2879cf',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 7,
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#2879cf',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#2879cf',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a3a5a',
  },
  infoLabel: {
    fontSize: 16,
    color: '#2879cf',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
  },
  bioSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  bioLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2879cf',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'justify',
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 15,
    marginBottom: 50,
  },
  actionButton: {
    backgroundColor: '#2879cf',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2879cf',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonTextSecondary: {
    color: '#2879cf',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
