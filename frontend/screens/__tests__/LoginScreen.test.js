import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from './LoginScreen'; // ajuste o caminho conforme necessário
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Mock do módulo axios
jest.mock('axios');

// Mock do módulo AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

// Mock do Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('LoginScreen', () => {
  const mockNavigation = {
    reset: jest.fn(),
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir um alerta de erro se os campos estiverem vazios', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('Entrar'));

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, preencha todos os campos.');
  });

  it('deve exibir um alerta de erro se a requisição falhar', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          error: 'Credenciais inválidas',
        },
      },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('Usuário'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Credenciais inválidas');
    });
  });

  it('deve exibir um alerta de sucesso e redirecionar para a tela Home se a requisição for bem-sucedida', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('Usuário'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Login realizado com sucesso!');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    });
  });

  it('deve navegar para a tela de registro quando o link "Cadastre-se" for pressionado', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('Cadastre-se'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });
});