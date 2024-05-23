import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FilterScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  const applyFilter = () => {
    if (selectedFilter) {
      navigation.navigate('Home', { filter: selectedFilter });
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecione um filtro:</Text>
      
      <TouchableOpacity
        style={[
          styles.button,
          selectedFilter === 'author' && styles.selectedButton
        ]}
        onPress={() => setSelectedFilter('author')}
      >
        <Text style={styles.buttonText}>Autor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          selectedFilter === 'title' && styles.selectedButton
        ]}
        onPress={() => setSelectedFilter('title')}
      >
        <Text style={styles.buttonText}>Título</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          selectedFilter === 'publisher' && styles.selectedButton
        ]}
        onPress={() => setSelectedFilter('publisher')}
      >
        <Text style={styles.buttonText}>Editora</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
        <Text style={styles.applyButtonText}>Aplicar Filtro</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: 'lightgray',
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FilterScreen;