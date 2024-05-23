// HomeScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation, route }) => {
  const filter = route.params?.filter || '';
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (newFilter) => {
    switch (newFilter) {
      case 'author':
        setSearchQuery('Autor: ');
        break;
      case 'title':
        setSearchQuery('Título: ');
        break;
      case 'publisher':
        setSearchQuery('Editora: ');
        break;
      default:
        setSearchQuery('');
    }
  };

  React.useEffect(() => {
    handleFilterChange(filter);
  }, [filter]);

  // Função para lidar com a navegação para a tela de filtro
  const goToFilterScreen = () => {
    navigation.navigate('Filter');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('./assets/logo.jpg')}
          style={{ width: 50, height: 50, resizeMode: 'contain', marginRight: 10 }}
        />
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={{ flex: 1, height: 40, borderWidth: 1, borderColor: 'gray', paddingHorizontal: 10 }}
            placeholder="Buscar livro..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={{ padding: 10 }} onPress={goToFilterScreen}>
            <Ionicons name="filter" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo da tela */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Listagem de anúncios</Text>

      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.footerText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
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
});

export default HomeScreen;
