import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const ViewBookScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`.../${bookId}/`);
        setBook(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.cover}
        source={{ uri: 'https://via.placeholder.com/500' }}
      />
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.title}>Título: </Text>
          <Text style={styles.dados}>{book.titulo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Autor: </Text>
          <Text style={styles.dados}>{book.autor}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Editora: </Text>
          <Text style={styles.dados}>{book.editora}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Ano de Impressão: </Text>
          <Text style={styles.dados}>{book.anoImpressao}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Condição: </Text>
          <Text style={styles.dados}>{book.condicao}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Valor: </Text>
          <Text style={styles.dados}>R${book.valor}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Descrição: </Text>
          <Text style={styles.dados}>{book.descricao}</Text>
        </View>
      </View>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    width: 160,
    height: 210,
    marginBottom: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: -1,
  },
  dados: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004a55',
    marginBottom: -1,
    flex: 1,
    textAlign: 'justify',
  },
  description: {
    fontSize: 18,
    color: '#000',
  },
 
});

export default ViewBookScreen;