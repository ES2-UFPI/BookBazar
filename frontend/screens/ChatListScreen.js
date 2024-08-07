import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
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

    const fetchChats = async () => {
      if (username) {
        try {
          const response = await axios.get('http://localhost:8000/api/recuperarChats/', {
            params: {
              username,
            },
          });
          setChats(response.data);
        } catch (error) {
          console.error('Error fetching chats', error);
        }
      }
    };

    getUsername();
    fetchChats();
  }, [username]);

  const handleChatPress = (receiverUsername) => {
    navigation.navigate('ChatScreen', { receiverUsername });
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleChatPress(item.username)} style={styles.chatItem}>
      <Text style={styles.chatText}>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.username}
        style={styles.chatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  chatList: {
    padding: 10,
  },
  chatItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ChatListScreen;
