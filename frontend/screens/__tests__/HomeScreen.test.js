import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import HomeScreen from '../HomeScreen'; // Ajuste o caminho conforme necessário

// Mock do axios
jest.mock('axios');
jest.mock('expo-location');

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar a tela inicial corretamente', () => {
    render(<HomeScreen navigation={{}} route={{ params: {} }} />);
    
    // Verifica se o header está presente
    expect(screen.getByRole('heading', { name: /recently added/i })).toBeTruthy();
    expect(screen.getByPlaceholderText('Pesquisar')).toBeTruthy();
    expect(screen.getByText('Início')).toBeTruthy();
    expect(screen.getByText('Anunciar')).toBeTruthy();
    expect(screen.getByText('Chat')).toBeTruthy();
    expect(screen.getByText('Eu')).toBeTruthy();
  });

  test('deve exibir mensagem de carregamento enquanto os dados estão sendo buscados', () => {
    // Simula uma requisição pendente
    axios.get.mockImplementation(() => new Promise(() => {}));
    render(<HomeScreen navigation={{}} route={{ params: {} }} />);

    expect(screen.getByText('Carregando...')).toBeTruthy();
  });

  test('deve exibir anúncios recentes ao carregar', async () => {
    // Mock da permissão de localização e dados de resposta
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 0, longitude: 0 } });
    axios.get.mockResolvedValue({ data: [{ id_anuncio: 1, titulo: 'Livro 1', valor: '20' }] });

    render(<HomeScreen navigation={{}} route={{ params: {} }} />);

    await waitFor(() => {
      expect(screen.getByText('Livro 1')).toBeTruthy();
      expect(screen.getByText('R$20')).toBeTruthy();
    });
  });

  test('deve buscar resultados ao pressionar o botão de busca', async () => {
    // Mock da permissão de localização e dados de resposta
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 0, longitude: 0 } });
    axios.get.mockResolvedValue({ data: [{ id_anuncio: 1, titulo: 'Livro 1', valor: '20' }] });

    render(<HomeScreen navigation={{}} route={{ params: {} }} />);

    fireEvent.changeText(screen.getByPlaceholderText('Pesquisar'), 'livro');
    fireEvent.press(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/api/pesquisar/', expect.any(Object));
    });
  });

  test('deve abrir e fechar o modal de filtro', async () => {
    render(<HomeScreen navigation={{}} route={{ params: {} }} />);
    
    fireEvent.press(screen.getByRole('button', { name: /filter/i }));
    
    // Verifica se o modal de filtro está visível
    expect(screen.getByText('FilterScreen')).toBeTruthy(); // Ajuste conforme necessário

    // Fecha o modal
    fireEvent.press(screen.getByRole('button', { name: /close/i })); // Substitua pelo botão de fechar

    // Verifica se o modal foi fechado
    expect(screen.queryByText('FilterScreen')).toBeNull();
  });

  test('deve mostrar alerta quando a permissão de localização é negada', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });
    
    const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});

    render(<HomeScreen navigation={{}} route={{ params: {} }} />);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Permissão de localização não concedida.');
    });
  });

  test('deve mostrar alerta quando ocorre um erro ao buscar anúncios', async () => {
    // Mock da permissão de localização e erro no axios
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 0, longitude: 0 } });
    axios.get.mockRejectedValue(new Error('Erro ao buscar anúncios'));

    const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});

    render(<HomeScreen navigation={{}} route={{ params: {} }} />);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Erro ao buscar livros recentes', 'Por favor, tente novamente.');
    });
  });

  test('deve navegar para a tela de detalhes do livro ao pressionar um item da lista', () => {
    const navigation = { navigate: jest.fn() };
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 0, longitude: 0 } });
    axios.get.mockResolvedValue({ data: [{ id_anuncio: 1, titulo: 'Livro 1', valor: '20' }] });

    render(<HomeScreen navigation={navigation} route={{ params: {} }} />);

    fireEvent.press(screen.getByText('Livro 1'));
    expect(navigation.navigate).toHaveBeenCalledWith('ViewBook', { bookId: 1 });
  });
});
