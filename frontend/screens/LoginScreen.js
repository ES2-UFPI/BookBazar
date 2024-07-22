import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
// import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const entrarUsuario  = () => {
    if (email === '' || senha === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    } else {
      // Lógica de autenticação
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.navigate('Home');
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
      <Text style={estilo.nomeRef}>Email: </Text>
      <TextInput
        style={estilo.entrada}
        placeholder="Usuário"
        onChangeText={setEmail}
        value={email}
      />
      <Text style={estilo.nomeRef}>Senha: </Text>
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
  nomeRef: {
    marginBottom: 3,
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 325,
  },
  entrada: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  btnEntrar: {
    width: "100%",
    backgroundColor: '#004a55',
    borderColor: 'black',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
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
