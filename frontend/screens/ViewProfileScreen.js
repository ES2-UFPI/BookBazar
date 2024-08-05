import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, SafeAreaView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const ViewProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState({ username: false, phone: false, email: false });
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const response = await axios.get('http://localhost:8000/api/profile/', { params: { username } });
        setProfile(response.data);
        setUsername(response.data.username);
        setPhone(response.data.phone);
        setEmail(response.data.email);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileDetails();
  }, []);

  const saveChanges = async () => {
    try {
      const usernameStored = await AsyncStorage.getItem('username');
      await axios.put(`http://localhost:8000/api/profile/${usernameStored}/`, {
        username,
        phone,
        email,
      });
      setIsEditing({ username: false, phone: false, email: false });
      fetchProfileDetails();
    } catch (error) {
      console.error(error);
    }
  };

  const goToHomeScreen = () => {
    navigation.navigate('Home');
  };

  const goToCreateAdScreen = () => {
    navigation.navigate('CreateAd');
  };

  const toggleEditing = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://via.placeholder.com/500' }}
        />
        <View style={styles.detailsContainer}>
          <View style={styles.itemContainer}>
            <View style={styles.row}>
              <Text style={styles.title}>Nome de Usuário: </Text>
              {isEditing.username ? (
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                />
              ) : (
                <Text style={styles.dados}>{profile.nome_usuario}</Text>
              )}
              <TouchableOpacity onPress={() => toggleEditing('username')}>
                <Ionicons name="create-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.row}>
              <Text style={styles.title}>Nome: </Text>
              <Text style={styles.dados}>{profile.nome}</Text>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.row}>
              <Text style={styles.title}>CPF: </Text>
              <Text style={styles.dados}>{profile.cpf_usuario}</Text>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.row}>
              <Text style={styles.title}>Data de Nascimento: </Text>
              <Text style={styles.dados}>{profile.data_nascimento}</Text>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.row}>
              <Text style={styles.title}>Telefone: </Text>
              {isEditing.phone ? (
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                />
              ) : (
                <Text style={styles.dados}>{profile.telefone}</Text>
              )}
              <TouchableOpacity onPress={() => toggleEditing('phone')}>
                <Ionicons name="create-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.row}>
              <Text style={styles.title}>Email: </Text>
              {isEditing.email ? (
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              ) : (
                <Text style={styles.dados}>{profile.email}</Text>
              )}
              <TouchableOpacity onPress={() => toggleEditing('email')}>
                <Ionicons name="create-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {Object.values(isEditing).some((editing) => editing) && (
          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={goToHomeScreen}>
          <Ionicons name="home-outline" size={24} color="black" />
          <Text style={styles.footerText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={goToCreateAdScreen}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
          <Text style={styles.footerText}>Anunciar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
          <Text style={styles.footerText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="person" size={24} color="#004a55" />
          <Text style={styles.footerTextSe1lected}>Eu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
    alignSelf: 'center',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  dados: {
    fontSize: 17,
    color: '#004a55',
    flex: 1,
    textAlign: 'justify',
  },
  input: {
    fontSize: 17,
    color: '#004a55',
    flex: 1,
    textAlign: 'justify',
    borderBottomWidth: 1,
    borderBottomColor: '#004a55',
  },
  saveButton: {
    backgroundColor: '#004a55',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    paddingVertical: 10,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  footerTextSelected: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#004a55',
  },
});

export default ViewProfileScreen;