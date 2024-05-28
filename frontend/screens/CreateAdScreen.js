import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const CreateAdScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [editora, setEditora] = useState('');
  const [anoImpressao, setAnoImpressao] = useState('');
  const [condicao, setCondicao] = useState('');
  const [cep, setCep] = useState('');
  const [valor, setValor] = useState('');

  getCoordinatesFromCep = async (cep) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=CHAVE_API`);
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
    console.log(coordinates)
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
      latitude: roundedLatitude,
      longitude: roundedLongitude,
    };
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/anunciar/', livro);
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

  return (
    <View style={estilo.container}>
      <StatusBar hidden />
      <View style={estilo.pagAnuncio}>
        <Text style={estilo.nomeRef}>Título: </Text>
        <TextInput style={estilo.entrada} onChangeText={titulo=>setTitulo(titulo)} value={titulo} />

        <Text style={estilo.nomeRef}>Autor: </Text>
        <TextInput style={estilo.entrada} onChangeText={autor=>setAutor(autor)} value={autor} />

        <Text style={estilo.nomeRef}>Editora: </Text>
        <TextInput style={estilo.entrada} onChangeText={editora=>setEditora(editora)} value={editora} />

        <Text style={estilo.nomeRef}>Ano de Impressão: </Text>
        <TextInput
          style={estilo.entrada}
          keyboardType="numeric"
          onChangeText={anoImpressao=>setAnoImpressao(anoImpressao)}
          value={anoImpressao}
        />

        <Text style={estilo.nomeRef}>Condição: </Text>
        <TextInput style={estilo.entrada} onChangeText={condicao => setCondicao(condicao)} value={condicao} />

        <Text style={estilo.nomeRef}>CEP do Anunciante: </Text>
        <TextInput
          style={estilo.entrada}
          keyboardType="numeric"
          onChangeText={cep => setCep(cep)}
          value={cep}
        />

        <Text style={estilo.nomeRef}>Valor: </Text>
        <TextInput 
          style={estilo.entrada} 
          keyboardType="numeric"
          onChangeText={valor => setValor(valor)} 
          value={valor}
        />

        <TouchableOpacity style={estilo.btnCriarAnuncio} onPress={()=>criarAnuncio()}>
            <Text style={{color:'white', fontSize:20, fontWeight: 'bold'}}>Criar Anúncio</Text>
        </TouchableOpacity>
      </View>
      
      <View style={estilo.footer}>
        <TouchableOpacity style={estilo.footerItem} onPress={goToHomeScreen}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={estilo.footerText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilo.footerItem}>
          <Ionicons name="add-circle-outline" size={24} color="#00009C" />
          <Text style={estilo.footerTextSelected}>Anunciar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilo.footerItem}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
          <Text style={estilo.footerText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilo.footerItem}>
          <Ionicons name="menu-outline" size={24} color="black" />
          <Text style={estilo.footerText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const estilo = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'left',
    justifyContent: 'left',
  },

  pagAnuncio: {
    padding: 10,
  },

  nomeRef: {
    marginTop: 10,
    marginBottom: 5,
    paddingLeft: 8,
    fontSize: 15,
    fontWeight: 'bold',
  },

  entrada: {
    width: "100%",
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 15,
  },

  btnCriarAnuncio: {
    width: "50%",
    marginLeft: 100,
    height: 40,
    marginTop: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },

  footer: {
    marginTop: 139,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 20,
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
    color: '#00009C',
  },
});

export default CreateAdScreen;