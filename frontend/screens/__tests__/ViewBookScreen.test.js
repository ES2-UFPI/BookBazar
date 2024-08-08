import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import ViewBookScreen from '../ViewBookScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');

const mockBookData = {
  id: 1,
  titulo: 'Livro Exemplo',
  autor: 'Autor Exemplo',
  editora: 'Editora Exemplo',
  ano_impressao: '2024',
  condicao: 'Novo',
  valor: '50.00',
  descricao: 'Descrição do livro.',
  username: 'vendedor'
};

const mockCommentsData = [
  { id_anuncio: 1, autor: 'Usuario1', texto: 'Comentário 1' },
  { id_anuncio: 1, autor: 'Usuario2', texto: 'Comentário 2' }
];

describe('ViewBookScreen', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValue('vendedor'); // Mock do AsyncStorage
  });

  test('renderiza os detalhes do livro corretamente', async () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockBookData })
    );
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockCommentsData })
    );

    const { getByText } = render(<ViewBookScreen route={{ params: { bookId: 1 } }} navigation={{}} />);

    await waitFor(() => {
      expect(getByText('Título:')).toBeTruthy();
      expect(getByText('Livro Exemplo')).toBeTruthy();
      expect(getByText('Autor:')).toBeTruthy();
      expect(getByText('Autor Exemplo')).toBeTruthy();
    });
  });

  test('Adicionam funcionalidade de comentário', async () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockBookData })
    );
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockCommentsData })
    );
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { id_anuncio: 1, autor: 'vendedor', texto: 'Novo Comentário' } })
    );

    const { getByPlaceholderText, getByText } = render(<ViewBookScreen route={{ params: { bookId: 1 } }} navigation={{}} />);

    fireEvent.changeText(getByPlaceholderText('Adicione um comentário ou pergunta...'), 'Novo Comentário');
    fireEvent.press(getByText('Enviar'));

    await waitFor(() => {
      expect(getByText('Novo Comentário')).toBeTruthy();
    });
  });

  test('mostra o estado de carregamento ao buscar dados do livro', () => {
    axios.get.mockImplementationOnce(() =>
      new Promise(() => {})); // Simula uma requisição pendente

    const { getByText } = render(<ViewBookScreen route={{ params: { bookId: 1 } }} navigation={{}} />);

    expect(getByText('Carregando...')).toBeTruthy();
  });
});