import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatListScreen from '../ChatListScreen'; // Ajuste o caminho conforme necessário
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native';

// Mock dos módulos axios e AsyncStorage
jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');

// Mock da navegação
const mockNavigation = {
  navigate: jest.fn(),
};

describe('ChatListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a lista de chats após a obtenção dos dados', async () => {
    // Mock do AsyncStorage
    AsyncStorage.getItem.mockResolvedValueOnce('testuser');

    // Mock da resposta da API
    axios.get.mockResolvedValueOnce({
      data: [
        { username: 'user1' },
        { username: 'user2' },
      ],
    });

    const { getByText } = render(<ChatListScreen navigation={mockNavigation} />);

    // Aguarda o estado ser atualizado e a lista ser renderizada
    await waitFor(() => {
      expect(getByText('user1')).toBeTruthy();
      expect(getByText('user2')).toBeTruthy();
    });
  });

  it('deve navegar para a tela de chat ao clicar em um item de chat', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('testuser');
    axios.get.mockResolvedValueOnce({
      data: [
        { username: 'user1' },
      ],
    });

    const { getByText } = render(<ChatListScreen navigation={mockNavigation} />);

    // Aguarda o item ser renderizado e clica nele
    await waitFor(() => {
      fireEvent.press(getByText('user1'));
    });

    // Verifica se a navegação foi chamada com os parâmetros corretos
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ChatScreen', { receiverUsername: 'user1' });
  });

  it('deve lidar com falha na obtenção do nome de usuário', async () => {
    // Mock do AsyncStorage que falha
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('Failed to fetch'));

    const { queryByText } = render(<ChatListScreen navigation={mockNavigation} />);

    // Aguarda a tela ser renderizada sem chats
    await waitFor(() => {
      expect(queryByText('user1')).toBeNull();
    });
  });

  it('deve lidar com falha na solicitação de chats', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('testuser');
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    const { queryByText } = render(<ChatListScreen navigation={mockNavigation} />);

    // Aguarda a tela ser renderizada sem chats
    await waitFor(() => {
      expect(queryByText('user1')).toBeNull();
    });
  });
});
