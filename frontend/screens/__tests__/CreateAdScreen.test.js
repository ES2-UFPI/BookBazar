import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateAdScreen from '../CreateAdScreen'; // ajuste o caminho conforme necessário
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mock = new MockAdapter(axios);

describe('CreateAdScreen', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('renderizar todos os campos de entrada e o botão criar anúncio', () => {
    const { getByText, getByPlaceholderText } = render(<CreateAdScreen />);

    expect(getByText('CEP do Anunciante:')).toBeTruthy();
    expect(getByPlaceholderText('CEP')).toBeTruthy();
    expect(getByText('Título:')).toBeTruthy();
    expect(getByPlaceholderText('Título')).toBeTruthy();
    expect(getByText('Autor:')).toBeTruthy();
    expect(getByPlaceholderText('Autor')).toBeTruthy();
    expect(getByText('Editora:')).toBeTruthy();
    expect(getByPlaceholderText('Editora')).toBeTruthy();
    expect(getByText('Ano de Impressão:')).toBeTruthy();
    expect(getByPlaceholderText('Ano de Impressão')).toBeTruthy();
    expect(getByText('Condição:')).toBeTruthy();
    expect(getByText('Usado')).toBeTruthy();
    expect(getByText('Novo')).toBeTruthy();
    expect(getByText('Valor:')).toBeTruthy();
    expect(getByPlaceholderText('Valor')).toBeTruthy();
    expect(getByText('Descrição:')).toBeTruthy();
    expect(getByPlaceholderText('Descrição')).toBeTruthy();
    expect(getByText('Criar Anúncio')).toBeTruthy();
  });

  it('cria anúncio ao pressionar o botão', async () => {
    const { getByText, getByPlaceholderText } = render(<CreateAdScreen />);
    
    // Mocking AsyncStorage getItem
    AsyncStorage.getItem = jest.fn().mockResolvedValue('testuser');

    // Mocking axios post request
    mock.onPost('http://localhost:8000/api/anunciar/').reply(201, {});

    // Filling out the form
    fireEvent.changeText(getByPlaceholderText('CEP'), '12345-678');
    fireEvent.changeText(getByPlaceholderText('Título'), 'Livro de Teste');
    fireEvent.changeText(getByPlaceholderText('Autor'), 'Autor de Teste');
    fireEvent.changeText(getByPlaceholderText('Editora'), 'Editora de Teste');
    fireEvent.changeText(getByPlaceholderText('Ano de Impressão'), '2022');
    fireEvent.changeText(getByPlaceholderText('Valor'), '19.99');
    fireEvent.changeText(getByPlaceholderText('Descrição'), 'Descrição de Teste');

    fireEvent.press(getByText('Criar Anúncio'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/anunciar/', expect.any(Object));
      expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Anúncio criado com sucesso!');
    });
  });
});