import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { ListItem } from 'react-native-elements';
import FilterScreen from './FilterScreen';
import axios from 'axios';

const HomeScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  useEffect(() => {
    if (route.params?.filter) {
      setFilter(route.params.filter);
    } else {
      setFilter('');
    }
  }, [route.params?.filter]);

  const handleFilterChange = (newFilter) => {
    setSearchQuery('');
    setFilter(newFilter);
  };

  const goToFilterScreen = () => {
    setIsFilterModalVisible(true);
  };

  const goToCreateAdScreen = () => {
    navigation.navigate('CreateAd');
  };

  const goToViewProfileScreen = () => {
    navigation.navigate('ViewProfile');
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
        Alert.alert('Permissão de localização não concedida.');
        return;
      }
      
      const { coords } = await Location.getCurrentPositionAsync({});
      if (!coords) {
        Alert.alert('Erro ao obter a localização.');
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

  const getBookItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ViewBook', { bookId: item.id_anuncio })}>
        <ListItem
          key={item.id_anuncio}
          bottomDivider
          containerStyle={styles.listItemContainer}
        >
          <View style={styles.resultItem}>
            <View style={styles.imagePlaceholder} />
            {item.distancia !== undefined && <Text style={styles.distancia}>{(item.distancia / 1000).toFixed(2)} km</Text>}
            <Text numberOfLines={1} style={styles.resultTitle}>{item.titulo}</Text>
            <Text style={styles.resultPrice}>R${item.valor}</Text>
          </View>
        </ListItem>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Image
            source={require('../assets/login1.png')}
            style={{ width: 50, height: 50, resizeMode: 'contain', marginRight: 5 }}
          />
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar"
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
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : (
            <FlatList
              data={results}
              renderItem={getBookItem}
              keyExtractor={(item) => item.id_anuncio.toString()}
              numColumns={2}
              contentContainerStyle={styles.flatListContainer}
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
          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('ChatList')}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.footerText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={goToViewProfileScreen}>
            <Ionicons name="person-outline" size={24} color="black" />
            <Text style={styles.footerText}>Eu</Text>
          </TouchableOpacity>
        </View>
    
        <Modal
          visible={isFilterModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsFilterModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FilterScreen
                applyFilter={(selectedFilter) => {
                  handleFilterChange(selectedFilter);
                  setIsFilterModalVisible(false);
                }}
                clearFilter={() => {
                  handleFilterChange('');
                  setIsFilterModalVisible(false);
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 15,
    paddingLeft: 5,
    color: 'black',
  },
  searchButton: {
    padding: 10,
    borderLeftWidth: 1,
    borderLeftColor: 'gray',
  },
  filterButton: {
    width: 50,
    height: 48,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    paddingVertical: 10,
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
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  flatListContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingLeft: 6,
    backgroundColor: '#f5f5f5',
  },
  listItemContainer: {
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultItem: {
    width: 170,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  distancia: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'green',
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
    marginTop: 5,
    textAlign: 'center',
  },
  resultPrice: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
    marginTop: 3,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '75%',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
  },
});

export default HomeScreen;