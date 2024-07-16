import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
//import axios from 'axios';

const UserScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCPF] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const cadastrarUsuario = async () => {
    const usuario = {
      nome: nome,
      cpf: cpf,
      dataNascimento: dataNascimento,
      email: email,
      senha: senha,
    };
    try {
      const response = await axios.post('...', usuario);
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível realizar o cadastro. Tente novamente.');
    }
  };

  return (
    <View style={estilo.container}>
      <View style={estilo.pagCadastro}>
        <Text style={estilo.nomeRef}>Nome: </Text>
        <TextInput style={estilo.entrada} onChangeText={nome=>setNome(nome)} value={nome} />

        <Text style={estilo.nomeRef}>CPF: </Text>
        <TextInput style={estilo.entrada} onChangeText={cpf=>setCPF(cpf)} value={cpf} />

        <Text style={estilo.nomeRef}>Data de Nascimento: </Text>
        <TextInput style={estilo.entrada} onChangeText={dataNascimento=>setDataNascimento(dataNascimento)} value={dataNascimento} />

        <Text style={estilo.nomeRef}>Email: </Text>
        <TextInput style={estilo.entrada} onChangeText={email=>setEmail(email)} value={email} />
        
        <Text style={estilo.nomeRef}>Senha: </Text>
        <TextInput style={estilo.entrada} onChangeText={senha=>setSenha(senha)} value={senha} />

        <TouchableOpacity style={estilo.btnCadastrarUsuario} onPress={()=>cadastrarUsuario()}>
            <Text style={{color:'white', fontSize:20, fontWeight: 'bold'}}>Cadastrar</Text>
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

  pagCadastro: {
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

  btnCadastrarUsuario: {
    width: "50%",
    marginLeft: 100,
    height: 40,
    marginTop: 10,
    backgroundColor: '#004a55',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default UserScreen;