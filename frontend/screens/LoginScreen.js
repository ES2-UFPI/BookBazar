import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const entrarUsuario = () => {
    if (usuario === '' || senha === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    } else {
      axios.post('http://localhost:8000/api/login/', {
        username: usuario, 
        password: senha
      })
      .then(async response => {
        await AsyncStorage.setItem('username', usuario);
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      })
      .catch(error => {
        if (error.response) {
          Alert.alert('Erro', error.response.data.error);
        } else {
          Alert.alert('Erro', 'Erro ao conectar com o servidor.');
        }
      });
    }
  };

  const cadastrarUsuario  = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={estilo.container}>
      <Image
        source={require('../assets/login1.png')}
        style={estilo.logo}
      />
      <TextInput
        style={estilo.entrada}
        placeholder="Usuário"
        onChangeText={setUsuario}
        value={usuario}
      />
      <TextInput
        style={estilo.entrada}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setSenha}
        value={senha}
      />
      <TouchableOpacity style={estilo.btnEntrar} onPress={entrarUsuario}>
        <Text style={estilo.btnEntrarTexto}>Entrar</Text>
      </TouchableOpacity>
      <Text style={estilo.cadastrarTexto}>
        Não tem uma conta? <Text style={estilo.cadastrarLink} onPress={cadastrarUsuario}>Cadastre-se</Text>
      </Text>
    </View>
  );
};

const estilo = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 1,
  },
  entrada: {
    width: '100%',
    height: 45,
    padding: 10,
    borderColor: 'gray',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  btnEntrar: {
    width: "100%",
    height: 45,
    padding: 10,
    borderColor: 'black',
    backgroundColor: '#004a55',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 2,
  },
  btnEntrarTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  cadastrarTexto: {
    marginTop: 15,
    marginBottom: 200,
    color: 'black',
    fontSize: 15,
  },
  cadastrarLink: {
    textDecorationLine: 'underline',
    color: '#004a55',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LoginScreen;