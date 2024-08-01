import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [cpf, setCPF] = useState('');
  const [nome, setNome] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const validarEntrada = () => {
    if (!cpf || cpf.length !== 11) {
      Alert.alert('Erro', 'CPF deve ter 11 dígitos.');
      return false;
    }
    if (!nome) {
      Alert.alert('Erro', 'Nome é obrigatório.');
      return false;
    }
    if (!nomeUsuario) { 
      Alert.alert('Erro', 'Nome de usuário é obrigatório.');
      return false;
    }
    if (!dataNascimento) {
      Alert.alert('Erro', 'Data de nascimento é obrigatória.');
      return false;
    }
    if (!telefone) {
      Alert.alert('Erro', 'Telefone é obrigatório.');
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      Alert.alert('Erro', 'Email inválido.');
      return false;
    }
    if (!senha || senha.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    if (!confirmarSenha || confirmarSenha.length < 6) {
      Alert.alert('Erro', 'Confirmar senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'Senhas diferentes.');
      return false;
    }
    return true;
  };

  const cadastrarUsuario = async () => {
    if (!validarEntrada()) {
      return;
    }

    setLoading(true);

    const usuario = {
      cpf_usuario: cpf,
      nome: nome,
      nome_usuario: nomeUsuario,
      data_nascimento: dataNascimento,
      telefone: telefone,
      email: email,
      senha: senha,
    };
    axios.post('http://localhost:8000/api/registrar/', usuario)
      .then(response => {
        console.log('Sucesso:', response.data);
        Alert.alert('Cadastro de usuário realizado com sucesso!');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Erro', 'Não foi possível realizar o cadastro. Tente novamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    
    <View style={estilo.container}>
      <ScrollView keyboardShowldPersistTaps="handled">
        <View style={estilo.pagCadastro}>
          <Text style={estilo.nomeRef}>CPF: </Text>
          <TextInput style={estilo.entrada} keyboardType="numeric" onChangeText={setCPF} value={cpf} />

          <Text style={estilo.nomeRef}>Nome: </Text>
          <TextInput style={estilo.entrada} onChangeText={setNome} value={nome} />

          <Text style={estilo.nomeRef}>Nome de Usuário: </Text>
          <TextInput style={estilo.entrada} onChangeText={setNomeUsuario} value={nomeUsuario} />

          <Text style={estilo.nomeRef}>Data de Nascimento: </Text>
          <TextInput style={estilo.entrada} onChangeText={setDataNascimento} value={dataNascimento} />

          <Text style={estilo.nomeRef}>Telefone: </Text>
          <TextInput style={estilo.entrada} keyboardType="phone-pad" onChangeText={setTelefone} value={telefone} />

          <Text style={estilo.nomeRef}>Email: </Text>
          <TextInput style={estilo.entrada} keyboardType="email-address" onChangeText={setEmail} value={email} />
          
          <Text style={estilo.nomeRef}>Senha: </Text>
          <TextInput style={estilo.entrada} secureTextEntry onChangeText={setSenha} value={senha} />

          <Text style={estilo.nomeRef}>Confirmar Senha: </Text>
          <TextInput style={estilo.entrada} secureTextEntry onChangeText={setConfirmarSenha} value={confirmarSenha} />

          <TouchableOpacity style={estilo.btnCadastrarUsuario} disabled={loading} onPress={cadastrarUsuario}>
              <Text style={{color:'white', fontSize:20, fontWeight: 'bold'}}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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

export default RegisterScreen;
