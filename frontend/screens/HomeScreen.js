import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { ListItem } from 'react-native-elements';
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
    navigation.navigate('CreateAd');
  };

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const params = { search: searchQuery };
      if (filter) {
        params.filter = filter;
      }
  
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida');
        return;
      }
      
      const { coords } = await Location.getCurrentPositionAsync({});
      if (!coords) {
        Alert.alert('Erro ao obter a localização');
        return;
      }
  
      params.latitude_usuario = coords.latitude;
      params.longitude_usuario = coords.longitude;
  
      const response = await axios.get('http://localhost:8000/api/pesquisar/', { params });
      console.log(response.data);
      setResults(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao buscar resultados', 'Por favor, tente novamente.');
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

  const getBookItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ViewBook', { bookId: item.id_anuncio })}>
      <ListItem
        key={item.id_anuncio}
        bottomDivider
        >
        <View style={styles.resultItem}>
          <View style={styles.imagePlaceholder}/>
          {item.distancia !== undefined && <Text style={styles.distancia}>{(item.distancia / 1000).toFixed(2)} km</Text>}
          <Text numberOfLines={1} style={styles.resultTitle}>{item.titulo}</Text>
          <Text>R${item.valor}</Text>
        </View>
      </ListItem>
      </TouchableOpacity>
    )
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={require('../assets/login1.png')}
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
            renderItem={getBookItem}
            keyExtractor={(item) => item.id_anuncio.toString()}
            numColumns={2}
          />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="home" size={24} color="#004a55" />
          <Text style={styles.footerTextSelected}>Início</Text>
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
    paddingVertical: 8,
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
    fontSize: 15,
    fontWeight: 'bold',
  },

  footerTextSelected: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#004a55',
  },

  resultItem: {
    width: 163,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    margin: 5,
  },

  resultTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },

  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 8,
  },

  btnComprar: {
    width: "50%",
    height: 35,
    marginTop: 10,
    backgroundColor: '#004a55',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  distancia: {
    fontSize: 12,         
    color: 'green',     
  },

});

export default HomeScreen;
