import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChatScreen = ({ route, navigation }) => {
  const { receiverUsername } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const getUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername);
      } catch (error) {
        console.error('Failed to fetch username from AsyncStorage', error);
      }
    };

    getUsername();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (username && receiverUsername) {
        try {
          const response = await axios.get('http://localhost:8000/api/recuperarChat/', {
            params: {
              sender_username: username,
              receiver_username: receiverUsername,
            },
          });
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages', error);
        }
      }
    };

    fetchMessages();
  }, [username, receiverUsername]);

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      Alert.alert('Campo de Mensagem Vazio', 'Por favor, digite uma mensagem.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/postarMensagem/', {
        sender_username: username,
        receiver_username: receiverUsername,
        conteudo_mensagem: message,
      });
      setMessages([...messages, response.data.mensagem]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      >
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.senderText}>{item.sender_username}</Text>
              <Text style={styles.messageText}>{item.conteudo_mensagem}</Text>
            </View>
          )}
          keyExtractor={item => item.id_mensagem.toString()}
          style={styles.messagesList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Enviar</Text>
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
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCC',
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#004a55',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  senderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
});

export default ChatScreen;
