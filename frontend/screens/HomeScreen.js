import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const HomeScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (route.params?.filter) {
      setFilter(route.params.filter);
    } else {
      setFilter('');
    }
  }, [route.params?.filter]);

  const handleFilterChange = (newFilter) => {
    setSearchQuery('');
  };

  const goToFilterScreen = () => {
    navigation.navigate('Filter');
  };

  const goToCreateAdScreen = () => {
    navigation.navigate('Anunciar Livro');
  };

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const params = { search: searchQuery };
      if (filter) {
        params.filter = filter;
      }
      const response = await axios.get('http://127.0.0.1:8000/api/pesquisar/', { params });
      setResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      fetchSearchResults();
    } else {
      Alert.alert('Campo de Busca Vazio', 'Por favor, digite um termo para buscar.');
    }
  };

  const renderResultItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DetalhesAnuncio', { id: item.id_anuncio })}>
      <View style={styles.resultItem}>
        <View style={styles.imagePlaceholder} />
        <Text style={styles.resultTitle}>{item.titulo}</Text>
        <Text>R${item.valor}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.jpg')}
          style={{ width: 50, height: 50, resizeMode: 'contain', marginRight: 10 }}
        />
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar livro..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={goToFilterScreen}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {loading ? (
          <Text>Carregando...</Text>
        ) : (
          <FlatList
            data={results}
            renderItem={renderResultItem}
            keyExtractor={(item) => item.id_anuncio.toString()}
            numColumns={2} // Show in two columns
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.footerText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={goToCreateAdScreen}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
          <Text style={styles.footerText}>Anunciar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
          <Text style={styles.footerText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="menu-outline" size={24} color="black" />
          <Text style={styles.footerText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchButton: {
    padding: 10,
    borderLeftWidth: 1,
    borderLeftColor: 'gray',
  },
  filterButton: {
    padding: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    marginTop: 5,
    fontSize: 12,
  },
  resultItem: {
    width: 150, // Fixed width for all ad items
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center', // Center items horizontally
    margin: 5, // Margin between grid items
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10, // Space above title
  },
  imagePlaceholder: {
    width: '100%', // Width occupying all available space
    height: 120, // Fixed height for image placeholder space
    backgroundColor: '#f0f0f0', // Background color to indicate reserved space
    marginBottom: 10, // Space below image
    borderRadius: 8, // Rounded border
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default HomeScreen;
