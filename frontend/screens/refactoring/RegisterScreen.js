import React, { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import TextInputField from './TextInputField'; // Componente de entrada
import SubmitButton from './SubmitButton'; // Componente de botão
import { styles } from './styles'; // Estilos

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

    try {
      const response = await axios.post('http://localhost:8000/api/registrar/', usuario);
      Alert.alert('Cadastro de usuário realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar o cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.pagCadastro}>
          <TextInputField label="CPF:" value={cpf} onChangeText={setCPF} keyboardType="numeric" />
          <TextInputField label="Nome:" value={nome} onChangeText={setNome} />
          <TextInputField label="Nome de Usuário:" value={nomeUsuario} onChangeText={setNomeUsuario} />
          <TextInputField label="Data de Nascimento:" value={dataNascimento} onChangeText={setDataNascimento} />
          <TextInputField label="Telefone:" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          <TextInputField label="Email:" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextInputField label="Senha:" value={senha} onChangeText={setSenha} secureTextEntry />
          <TextInputField label="Confirmar Senha:" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
          <SubmitButton onPress={cadastrarUsuario} title="Finalizar Cadastro" disabled={loading} />
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;