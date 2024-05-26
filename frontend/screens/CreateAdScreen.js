import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CreateAdScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [editora, setEditora] = useState('');
  const [anoImpressao, setAnoImpressao] = useState('');
  const [valor, setValor] = useState('');

  const criarAnuncio = () => {
    const livro = {
      titulo: titulo,
      autor: autor,
      editora: editora,
      anoImpressao: anoImpressao,
      valor: valor,
    };
    navigation.navigate('Home');
  };

  // Função para lidar com a navegação para a tela de anunciar livro.
  const goToCreateAdScreenn = () => {
    navigation.navigate('Anunciar Livro');
  };

  return (
    <View style={estilo.container}>
      <Text style={estilo.nomeRef}>Título: </Text>
      <TextInput style={estilo.entrada} onChangeText={titulo=>setTitulo(titulo)} />

      <Text style={estilo.nomeRef}>Autor: </Text>
      <TextInput style={estilo.entrada} onChangeText={autor=>setAutor(autor)} />

      <Text style={estilo.nomeRef}>Editora: </Text>
      <TextInput style={estilo.entrada} onChangeText={editora=>setEditora(editora)} />

      <Text style={estilo.nomeRef}>Ano de Impressão: </Text>
      <TextInput style={estilo.entrada} onChangeText={anoImpressao=>setAnoImpressao(anoImpressao)} />

      <Text style={estilo.nomeRef}>Valor: </Text>
      <TextInput style={estilo.entrada} onChangeText={valor=>setValor(valor)} />

      <TouchableOpacity style={estilo.btnCriarAnuncio} onPress={()=>criarAnuncio()}>
        <Text style={{color:'white', fontSize:25}}>Criar Anúncio</Text>
      </TouchableOpacity>
    </View>
  );
};

const estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'left',
    justifyContent: 'left',
    padding: 15,
  },

  nomeRef: {
    marginTop: 10,
    marginBottom: 5,
    paddingLeft: 8,
    fontSize: 20,
  },

  entrada: {
    width: "100%",
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 20,
  },

  btnCriarAnuncio: {
    width: "100%",
    height: 40,
    marginTop: 10,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default CreateAdScreen;