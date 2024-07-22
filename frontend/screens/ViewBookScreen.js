import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const ViewBookScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

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

  const handleAddComment = async () => {
    if (comment.trim() === '') {
      Alert.alert('Campo de Comentário Vazio', 'Por favor, digite um comentário ou pergunta.');
      return;
    }

    try {
      const newComment = {
        book: bookId,
        author: 'User', // Substitua pelo nome do usuário autenticado
        text: comment,
      };

      const response = await axios.post('...', newComment);
      setComments([...comments, response.data]);
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };

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

      <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>Comentários e Perguntas:</Text>
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Text style={styles.commentAuthor}>{item.autor}</Text>
              <Text style={styles.commentText}>{item.comentario}</Text>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>

      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicione um comentário ou pergunta..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddComment}>
          <Text style={styles.addButtonText}>Enviar</Text>
        </TouchableOpacity>
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
  commentsContainer: {
    marginBottom: 20,
  },
  commentsTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  commentText: {
    fontSize: 16,
    color: '#004a55',
    marginLeft: 10,
    textAlign: 'justify',
    fontStyle: 'italic',
  },
  commentType: {
    fontSize: 12,
    color: '#888',
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -15,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 9,
    marginRight: 10,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#004a55',
    padding: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default ViewBookScreen;