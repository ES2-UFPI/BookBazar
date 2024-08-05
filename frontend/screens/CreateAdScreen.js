import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Keyboard, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const CreateAdScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [editora, setEditora] = useState('');
  const [anoImpressao, setAnoImpressao] = useState('');
  const [condicao, setCondicao] = useState('Usado');
  const [cep, setCep] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  getCoordinatesFromCep = async (cep) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=CHAVE`);
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        return null; // Caso não encontre resultados
      }
    } catch (error) {
      console.error('Erro ao obter coordenadas:', error);
      return null;
    }
  };

  const criarAnuncio = async () => {
    // Obter coordenadas a partir do Cep
    const coordinates = await getCoordinatesFromCep(cep);
    if (!coordinates) {
      Alert.alert('Erro', 'CEP inválido ou não encontrado. Verifique o CEP informado.');
      return;
    }

    const roundTo5Decimals = (num) => {
      return Math.round(num * 100000) / 100000; // 100000 = 10^5, arredonda para 5 casas decimais
    };
    
    const roundedLatitude = roundTo5Decimals(coordinates.latitude);
    const roundedLongitude = roundTo5Decimals(coordinates.longitude);
  
    const livro = {
      titulo: titulo,
      autor: autor,
      editora: editora,
      valor: parseFloat(valor),
      cep_anuncio: cep,
      ano_impressao: parseInt(anoImpressao),
      condicao: condicao,
      descricao: descricao,
      latitude: roundedLatitude,
      longitude: roundedLongitude,
    };
    try {
      const response = await axios.post('http://localhost:8000/api/anunciar/', livro);
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Anúncio criado com sucesso!');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível criar o anúncio. Tente novamente.');
    }
  };

  const goToHomeScreen = () => {
    navigation.navigate('Home');
  };

  const goToCreateAdScreen = () => {
    navigation.navigate('CreateAd');
  };

  const goToViewProfileScreen = () => {
    navigation.navigate('ViewProfile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>CEP do Anunciante: </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={cep => setCep(cep)}
            value={cep}
          />

          <Text style={styles.label}>Título: </Text>
          <TextInput style={styles.input} onChangeText={titulo => setTitulo(titulo)} value={titulo} />

          <Text style={styles.label}>Autor: </Text>
          <TextInput style={styles.input} onChangeText={autor => setAutor(autor)} value={autor} />

          <View style={styles.row}>
            <View style={styles.largeColumn}>
              <Text style={styles.label}>Editora: </Text>
              <TextInput style={styles.input} onChangeText={editora => setEditora(editora)} value={editora} />
            </View>
            <View style={styles.smallColumn}>
              <Text style={styles.label}>Ano de Impressão: </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={anoImpressao => setAnoImpressao(anoImpressao)}
                value={anoImpressao}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.largeColumn}>
              <Text style={styles.label}>Condição: </Text>
              <Picker
                selectedValue={condicao}
                style={styles.input}
                onValueChange={(itemValue) => setCondicao(itemValue)}
              >
                <Picker.Item label="Usado" value="Usado" />
                <Picker.Item label="Novo" value="Novo" />
              </Picker>
            </View>
            <View style={styles.smallColumn}>
              <Text style={styles.label}>Valor: </Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric"
                onChangeText={valor => setValor(valor)} 
                value={valor}
              />
            </View>
          </View>

          <Text style={styles.label}>Descrição: </Text>
          <TextInput 
            style={[styles.input, styles.descriptionInput]}
            multiline
            numberOfLines={5}
            onChangeText={descricao => setDescricao(descricao)} 
            value={descricao}
          />

          <TouchableOpacity style={styles.btnCreateAd} onPress={() => criarAnuncio()}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Criar Anúncio</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {!keyboardVisible && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerItem} onPress={goToHomeScreen}>
            <Ionicons name="home-outline" size={24} color="black" />
            <Text style={styles.footerText}>Início</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={goToCreateAdScreen}>
            <Ionicons name="add-circle" size={24} color="#004a55" />
            <Text style={styles.footerTextSelected}>Anunciar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.footerText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={goToViewProfileScreen}>
            <Ionicons name="person-outline" size={24} color="black" />
            <Text style={styles.footerText}>Eu</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 10,
    paddingBottom: 70,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    paddingLeft: 8,
    fontSize: 15,
    fontWeight: 'bold',
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: 'gray',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    textAlign: 'justify',
  },
  btnCreateAd: {
    width: "100%",
    height: 40,
    marginTop: 12,
    backgroundColor: '#004a55',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  largeColumn: {
    flex: 2,
    marginRight: 3,
  },
  smallColumn: {
    flex: 1,
    marginLeft: 3,
  },
});

export default CreateAdScreen;