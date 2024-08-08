import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import ChatScreen from '../ChatScreen'; // Ajuste o caminho conforme necessário
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, TextInput } from 'react-native';

// Mock dos módulos axios e AsyncStorage
jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');

// Mock da navegação e das propriedades da rota
const mockNavigation = { navigate: jest.fn() };
const mockRoute = { params: { receiverUsername: 'user2' } };

describe('ChatScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a tela e listar mensagens após a obtenção dos dados', async () => {
    // Mock do AsyncStorage
    AsyncStorage.getItem.mockResolvedValueOnce('testuser');

    // Mock da resposta da API
    axios.get.mockResolvedValueOnce({
      data: [
        { id_mensagem: 1, sender_username: 'user1', conteudo_mensagem: 'Hello' },
        { id_mensagem: 2, sender_username: 'user2', conteudo_mensagem: 'Hi' },
      ],
    });

    render(<ChatScreen route={mockRoute} navigation={mockNavigation} />);

    // Aguarda a lista de mensagens ser renderizada
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeTruthy();
      expect(screen.getByText('Hi')).toBeTruthy();
    });
  });

  it('deve enviar uma mensagem e atualizar a lista de mensagens', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('testuser');
    axios.get.mockResolvedValueOnce({
      data: [{ id_mensagem: 1, sender_username: 'user1', conteudo_mensagem: 'Hello' }],
    });
    axios.post.mockResolvedValueOnce({
      data: { mensagem: { id_mensagem: 2, sender_username: 'testuser', conteudo_mensagem: 'New message' } },
    });

    render(<ChatScreen route={mockRoute} navigation={mockNavigation} />);

    // Preenche o campo de mensagem e envia
    fireEvent.changeText(screen.getByPlaceholderText('Digite sua mensagem...'), 'New message');
    fireEvent.press(screen.getByText('Enviar'));

    // Aguarda a nova mensagem ser adicionada
    await waitFor(() => {
      expect(screen.getByText('New message')).toBeTruthy();
    });
  });

  it('deve lidar com falha na obtenção do nome de usuário', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<ChatScreen route={mockRoute} navigation={mockNavigation} />);

    // Verifica que não há mensagens renderizadas
    await waitFor(() => {
      expect(screen.queryByText('Hello')).toBeNull();
    });
  });

  it('deve lidar com falha na recuperação das mensagens', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('testuser');
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<ChatScreen route={mockRoute} navigation={mockNavigation} />);

    // Verifica que não há mensagens renderizadas
    await waitFor(() => {
      expect(screen.queryByText('Hello')).toBeNull();
    });
  });

  it('deve lidar com falha no envio de mensagens', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('testuser');
    axios.get.mockResolvedValueOnce({
      data: [{ id_mensagem: 1, sender_username: 'user1', conteudo_mensagem: 'Hello' }],
    });
    axios.post.mockRejectedValueOnce(new Error('Failed to send'));

    render(<ChatScreen route={mockRoute} navigation={mockNavigation} />);

    // Preenche o campo de mensagem e tenta enviar
    fireEvent.changeText(screen.getByPlaceholderText('Digite sua mensagem...'), 'New message');
    fireEvent.press(screen.getByText('Enviar'));

    // Verifica que a mensagem não foi adicionada
    await waitFor(() => {
      expect(screen.queryByText('New message')).toBeNull();
    });
  });
});
