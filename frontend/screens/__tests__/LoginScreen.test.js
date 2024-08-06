import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa todos os mocks antes de cada teste
  });

  it('renderiza todos os componentes corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);
    expect(getByPlaceholderText('Usuário')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
    //expect(getByText('Não tem uma conta?')).toBeTruthy();
    expect(getByText('Cadastre-se')).toBeTruthy();
  });

  it('exibe erro quando os campos estão vazios', () => {
    const { getByText } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);
    fireEvent.press(getByText('Entrar'));
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, preencha todos os campos.');
  });

  it('faz uma chamada à API e navega com sucesso no login', async () => {
    const navigateMock = jest.fn();
    axios.post.mockResolvedValueOnce({ data: { token: 'dummy-token' } });
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={{ navigate: navigateMock }} />);

    fireEvent.changeText(getByPlaceholderText('Usuário'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/login/', {
      username: 'testuser',
      password: 'password'
    }));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
    expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Login realizado com sucesso!');
    expect(navigateMock).toHaveBeenCalledWith('Home');
  });

  it('exibe mensagem de erro no login falho ', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'Invalid credentials' } } });
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);

    fireEvent.changeText(getByPlaceholderText('Usuário'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'wrongpassword');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Invalid credentials'));
  });

  it('navega para a tela de cadastro', () => {
    const navigateMock = jest.fn();
    const { getByText } = render(<LoginScreen navigation={{ navigate: navigateMock }} />);
    fireEvent.press(getByText('Cadastre-se'));
    expect(navigateMock).toHaveBeenCalledWith('Register');
  });
});