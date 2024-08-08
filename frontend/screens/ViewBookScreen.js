import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, ScrollView, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const ViewBookScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState('');
  
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/visualizar/', { params: { id_anuncio: bookId } });
        setBook(response.data);
        //setComments(response.data.comments || []);
        fetchComments();

        const username = await AsyncStorage.getItem('username');
        setLoggedInUser(username);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/recuperarComentarios/', { params: { id_anuncio: bookId } });
        setComments(response.data); // Atualiza o estado com os comentários recuperados
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleAddComment = async () => {
    const username = await AsyncStorage.getItem('username');
    if (comment.trim() === '') {
      Alert.alert('Campo de Comentário Vazio', 'Por favor, digite um comentário ou pergunta.');
      return;
    }

    try {
      const newComment = {
        id_anuncio: bookId,
        autor: username, // Substitua pelo nome do usuário autenticado
        texto: comment,
      };

      const response = await axios.post('http://localhost:8000/api/comentar/', newComment);
      //setComments([...comments, response.data]);
      setComments(prevComments => [...prevComments, response.data]);
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };
  
  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const goToChatScreen = () => {
    navigation.navigate('ChatScreen', { receiverUsername: book.username });
  };

  const goToHomeScreen = () => {
    navigation.navigate('Home');
  };

  const goToCreateAdScreen = () => {
    navigation.navigate('CreateAd');
  };

  const goToViewProfileScreen = () => {
    navigation.navigate('ViewProfile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
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
              <Text style={styles.dados}>{book.ano_impressao}</Text>
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
            {loggedInUser !== book.username && (
              <TouchableOpacity style={styles.chatButton} onPress={goToChatScreen}>
                <Text style={styles.chatButtonText}>Fale com o vendedor</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitle}>Comentários e Perguntas:</Text>
            <FlatList
              data={comments}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentAuthor}>{item.autor}</Text>
                  <Text style={styles.commentText}>{item.texto}</Text>
                </View>
              )}
              keyExtractor={item => item.id_anuncio.toString()}
            />
          </View>

          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.input}
              placeholder="Adicione um comentário ou pergunta..."
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={handleAddComment}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddComment}>
              <Text style={styles.addButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerItem} onPress={goToHomeScreen}>
            <Ionicons name="home-outline" size={24} color="black" />
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
          <TouchableOpacity style={styles.footerItem} onPress={goToViewProfileScreen}>
            <Ionicons name="person-outline" size={24} color="black" />
            <Text style={styles.footerText}>Eu</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 60,
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
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: -1,
  },
  dados: {
    fontSize: 17,
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
    marginBottom: 1,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentItem: {
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  commentAuthor: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  commentText: {
    fontSize: 16,
    color: '#004a55',
    marginLeft: 5,
    textAlign: 'justify',
  },
  commentType: {
    fontSize: 12,
    color: '#888',
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 9,
    marginRight: 10,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#004a55',
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  chatButton: {
    backgroundColor: '#004a55',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ViewBookScreen;