import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import FilterScreen from '../FilterScreen'; // Ajuste o caminho conforme necessário

describe('FilterScreen', () => {
  // Mock das funções de filtro
  const mockApplyFilter = jest.fn();
  const mockClearFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a tela e exibir todos os filtros e botões', () => {
    render(<FilterScreen applyFilter={mockApplyFilter} clearFilter={mockClearFilter} />);

    expect(screen.getByText('Escolher Filtro:')).toBeTruthy();
    expect(screen.getByText('Autor')).toBeTruthy();
    expect(screen.getByText('Título')).toBeTruthy();
    expect(screen.getByText('Editora')).toBeTruthy();
    expect(screen.getByText('Limpar')).toBeTruthy();
    expect(screen.getByText('Aplicar')).toBeTruthy();
  });

  it('deve selecionar um filtro quando pressionado', () => {
    render(<FilterScreen applyFilter={mockApplyFilter} clearFilter={mockClearFilter} />);

    // Pressiona o botão "Autor"
    fireEvent.press(screen.getByText('Autor'));

    // Verifica se o botão "Autor" está selecionado
    expect(screen.getByText('Autor').parent.props.style).toEqual(expect.arrayContaining([
      expect.objectContaining({ backgroundColor: 'gray' }),
    ]));
  });

  it('deve aplicar o filtro selecionado quando pressionado', () => {
    render(<FilterScreen applyFilter={mockApplyFilter} clearFilter={mockClearFilter} />);

    // Seleciona o filtro "Título"
    fireEvent.press(screen.getByText('Título'));

    // Pressiona o botão "Aplicar"
    fireEvent.press(screen.getByText('Aplicar'));

    // Verifica se a função mockApplyFilter foi chamada com o filtro "Título"
    expect(mockApplyFilter).toHaveBeenCalledWith('title');
  });

  it('deve limpar o filtro selecionado quando pressionado', () => {
    render(<FilterScreen applyFilter={mockApplyFilter} clearFilter={mockClearFilter} />);

    // Seleciona o filtro "Editora"
    fireEvent.press(screen.getByText('Editora'));

    // Pressiona o botão "Limpar"
    fireEvent.press(screen.getByText('Limpar'));

    // Verifica se a função mockClearFilter foi chamada
    expect(mockClearFilter).toHaveBeenCalled();
  });
});
