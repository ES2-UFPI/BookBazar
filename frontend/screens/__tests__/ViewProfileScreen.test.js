import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ViewProfileScreen from './ViewProfileScreen';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mock = new MockAdapter(axios);

describe('ViewProfileScreen', () => {
  beforeAll(async () => {
    await AsyncStorage.setItem('username', 'testuser');
  });

  afterAll(async () => {
    await AsyncStorage.clear();
  });

  it('busca e exibe dados de perfil', async () => {
    const profileData = {
      nome_usuario: 'testuser',
      nome: 'Test User',
      cpf_usuario: '123.456.789-00',
      data_nascimento: '01/01/2000',
      telefone: '1234567890',
      email: 'testuser@example.com',
    };

    mock.onGet('http://localhost:8000/api/recuperarPerfil/', { params: { username: 'testuser' } }).reply(200, profileData);

    const { getByText, queryByText } = render(<ViewProfileScreen navigation={{ navigate: jest.fn() }} />);

    await waitFor(() => expect(getByText('Carregando...')).toBeNull());

    expect(getByText('Nome de Usuário:')).toBeTruthy();
    expect(getByText('testuser')).toBeTruthy();
    expect(getByText('Nome:')).toBeTruthy();
    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('CPF:')).toBeTruthy();
    expect(getByText('123.456.789-00')).toBeTruthy();
    expect(getByText('Data de Nascimento:')).toBeTruthy();
    expect(getByText('01/01/2000')).toBeTruthy();
    expect(getByText('Telefone:')).toBeTruthy();
    expect(getByText('1234567890')).toBeTruthy();
    expect(getByText('Email:')).toBeTruthy();
    expect(getByText('testuser@example.com')).toBeTruthy();
  });

  it('navega para a tela inicial', async () => {
    const profileData = {
      nome_usuario: 'testuser',
      nome: 'Test User',
      cpf_usuario: '123.456.789-00',
      data_nascimento: '01/01/2000',
      telefone: '1234567890',
      email: 'testuser@example.com',
    };

    mock.onGet('http://localhost:8000/api/recuperarPerfil/', { params: { username: 'testuser' } }).reply(200, profileData);

    const navigate = jest.fn();
    const { getByText } = render(<ViewProfileScreen navigation={{ navigate }} />);

    await waitFor(() => expect(getByText('testuser')).toBeTruthy());

    fireEvent.press(getByText('Início').parentNode);

    expect(navigate).toHaveBeenCalledWith('Home');
  });

  it('navega para a tela CreateAd', async () => {
    const profileData = {
      nome_usuario: 'testuser',
      nome: 'Test User',
      cpf_usuario: '123.456.789-00',
      data_nascimento: '01/01/2000',
      telefone: '1234567890',
      email: 'testuser@example.com',
    };

    mock.onGet('http://localhost:8000/api/recuperarPerfil/', { params: { username: 'testuser' } }).reply(200, profileData);

    const navigate = jest.fn();
    const { getByText } = render(<ViewProfileScreen navigation={{ navigate }} />);

    await waitFor(() => expect(getByText('testuser')).toBeTruthy());

    fireEvent.press(getByText('Anunciar').parentNode);

    expect(navigate).toHaveBeenCalledWith('CreateAd');
  });
});