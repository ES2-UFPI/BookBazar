import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FilterScreen = ({ applyFilter, clearFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Escolher Filtro:</Text>

      <TouchableOpacity
        style={[styles.button, selectedFilter === 'author' && styles.selectedButton]}
        onPress={() => setSelectedFilter('author')}
      >
        <Text style={styles.buttonText}>Autor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedFilter === 'title' && styles.selectedButton]}
        onPress={() => setSelectedFilter('title')}
      >
        <Text style={styles.buttonText}>Título</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedFilter === 'publisher' && styles.selectedButton]}
        onPress={() => setSelectedFilter('publisher')}
      >
        <Text style={styles.buttonText}>Editora</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.clearButton} onPress={clearFilter}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyButton} onPress={() => applyFilter(selectedFilter)}>
          <Text style={styles.applyButtonText}>Aplicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    paddingLeft: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  selectedButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    width: '48%',
    height: 40,
    backgroundColor: '#8b0000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  applyButton: {
    width: '48%',
    height: 40,
    backgroundColor: '#004a55',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default FilterScreen;