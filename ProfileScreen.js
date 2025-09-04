import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { colors } from './theme';
import { useAuth } from './AuthContext';

export default function ProfileScreen({ navigation }) {
  const { darkMode, updateDarkMode } = useAuth();
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editableData, setEditableData] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+351 912 345 678',
    location: 'Lisboa, Portugal',
    bio: 'Desenvolvedor apaixonado por tecnologia e inovação. Sempre em busca de novos desafios e aprendizados.',
  });
  
  const profileData = {
    name: editableData.name,
    email: editableData.email,
    phone: editableData.phone,
    location: editableData.location,
    joinDate: 'Janeiro 2024',
    bio: editableData.bio,
  };

  // Carregar foto salva quando o componente montar
  useEffect(() => {
    loadProfileImage();
    loadProfileData();
    requestPermissions();
  }, []);

  // Solicitar permissões para acessar galeria e câmera
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (galleryStatus !== 'granted' || cameraStatus !== 'granted') {
        Alert.alert('Permissões necessárias', 'Precisamos de permissão para acessar sua galeria e câmera.');
      }
    }
  };

  // Função para carregar a foto salva
  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.log('Erro ao carregar foto:', error);
    }
  };

  // Função para carregar dados do perfil salvos
  const loadProfileData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('profileData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setEditableData(parsedData);
      }
    } catch (error) {
      console.log('Erro ao carregar dados do perfil:', error);
    }
  };

  // Função para selecionar foto da galeria
  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0].uri;
        setProfileImage(selectedImage);
        saveProfileImage(selectedImage);
      }
    } catch (error) {
      console.log('Erro ao selecionar foto da galeria:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a foto da galeria.');
    }
  };

  // Função para tirar foto com a câmera
  const takePhotoWithCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const capturedImage = result.assets[0].uri;
        setProfileImage(capturedImage);
        saveProfileImage(capturedImage);
      }
    } catch (error) {
      console.log('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  // Função para alterar foto
  const changeProfileImage = () => {
    Alert.alert(
      'Alterar Foto',
      'Escolha uma opção:',
      [
        {
          text: 'Tirar Foto',
          onPress: takePhotoWithCamera
        },
        {
          text: 'Escolher da Galeria',
          onPress: pickImageFromGallery
        },
        {
          text: 'Usar Foto Padrão',
          onPress: () => {
            const defaultImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face';
            setProfileImage(defaultImage);
            saveProfileImage(defaultImage);
          }
        },
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {}
        }
      ],
      {
        cancelable: true,
        onDismiss: () => {}
      }
    );
  };

  // Função para salvar a foto no AsyncStorage
  const saveProfileImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem('profileImage', imageUri);
      Alert.alert('Sucesso', 'Foto do perfil alterada com sucesso!');
    } catch (error) {
      console.log('Erro ao salvar foto:', error);
      Alert.alert('Erro', 'Não foi possível salvar a foto.');
    }
  };

  // Função para abrir modal de edição
  const openEditModal = () => {
    setIsEditModalVisible(true);
  };

  // Função para fechar modal de edição
  const closeEditModal = () => {
    setIsEditModalVisible(false);
  };

  // Função para salvar dados editados
  const saveEditedData = async () => {
    try {
      // Salvar dados no AsyncStorage
      await AsyncStorage.setItem('profileData', JSON.stringify(editableData));
      
      // Fechar modal
      setIsEditModalVisible(false);
      
      // Mostrar mensagem de sucesso
      Alert.alert('Sucesso', 'Dados do perfil atualizados com sucesso!');
    } catch (error) {
      console.log('Erro ao salvar dados:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados do perfil.');
    }
  };

  // Função para atualizar campo editável
  const updateField = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: darkMode ? colors.darkBackground : colors.lightBackground }]} 
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
            source={{ uri: profileImage }}
            style={styles.avatar}
          />
          <View style={styles.onlineIndicator} />
          
          {/* Ícone de edição sobreposto na foto */}
          <TouchableOpacity 
            style={styles.editIconContainer} 
            onPress={changeProfileImage}
            activeOpacity={0.8}
          >
            <View style={styles.editIcon}>
              <Text style={styles.editIconText}>📷</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.name, { color: darkMode ? colors.textDark : colors.textLight }]}>{profileData.name}</Text>
        <Text style={styles.email}>{profileData.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Telefone</Text>
          <Text style={[styles.infoValue, { color: darkMode ? colors.textDark : colors.textLight }]}>{profileData.phone}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Localização</Text>
          <Text style={[styles.infoValue, { color: darkMode ? colors.textDark : colors.textLight }]}>{profileData.location}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Membro desde</Text>
          <Text style={[styles.infoValue, { color: darkMode ? colors.textDark : colors.textLight }]}>{profileData.joinDate}</Text>
        </View>
      </View>

      <View style={styles.bioSection}>
        <Text style={styles.bioLabel}>Sobre mim</Text>
        <Text style={[styles.bioText, { color: darkMode ? colors.textDark : colors.textLight }]}>{profileData.bio}</Text>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={openEditModal}>
          <Text style={styles.actionButtonText}>Editar Perfil ✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Edição */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={closeEditModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome</Text>
                <TextInput
                  style={styles.textInput}
                  value={editableData.name}
                  onChangeText={(text) => updateField('name', text)}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={editableData.email}
                  onChangeText={(text) => updateField('email', text)}
                  placeholder="Digite seu email"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefone</Text>
                <TextInput
                  style={styles.textInput}
                  value={editableData.phone}
                  onChangeText={(text) => updateField('phone', text)}
                  placeholder="Digite seu telefone"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Localização</Text>
                <TextInput
                  style={styles.textInput}
                  value={editableData.location}
                  onChangeText={(text) => updateField('location', text)}
                  placeholder="Digite sua localização"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sobre mim</Text>
                <TextInput
                  style={styles.textInput}
                  value={editableData.bio}
                  onChangeText={(text) => updateField('bio', text)}
                  placeholder="Digite uma breve descrição sobre você"
                  placeholderTextColor="#666"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveEditedData}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  editIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  editIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: 35,
    height: 35,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
  },
  editIconText: {
    fontSize: 14,
    color: '#fff',
  },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#021123',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#2879cf',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a3a5a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2879cf',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1a3a5a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2879cf',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1a3a5a',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#2879cf',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a3a5a',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2879cf',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2879cf',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2879cf',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
