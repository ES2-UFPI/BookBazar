import React from 'react';
import { StatusBar, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import FilterScreen from './screens/FilterScreen';
import CreateAdScreen from './screens/CreateAdScreen';
import ViewBookScreen from './screens/ViewBookScreen';
import ViewProfileScreen from './screens/ViewProfileScreen';
import ChatScreen from './screens/ChatScreen';
import ChatListScreen from './screens/ChatListScreen';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();

const BookBazar = () => {
  const handleLogout = async (navigation) => {
    try {
      await AsyncStorage.removeItem('username'); // Remove o token de autenticação
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer logout.');
    }
  };

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="lightgray" barStyle="dark-content"/>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={screenOptions}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: 'Cadastrar Usuário',
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'BookBazar',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => handleLogout(navigation)}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="log-out-outline" size={30} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Filter"
          component={FilterScreen}
          options={{
            title: 'Escolher Filtro',
          }}
        />
        <Stack.Screen
          name="CreateAd"
          component={CreateAdScreen}
          options={{
            title: 'Anunciar Livro'
          }}
        />
        <Stack.Screen
          name="ViewBook"
          component={ViewBookScreen}
          options={{
            title: 'Visualizar Livro'
          }}
        />
        <Stack.Screen
          name="ViewProfile"
          component={ViewProfileScreen}
          options={{
            title: 'Visualizar Perfil'
          }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            title: 'Chat',
          }}
        />
        <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen} 
        options={{ 
            title: 'Chats' 
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const screenOptions = {
  headerStyle: {
    backgroundColor: 'lightgray'
  },
  headerTintColor: 'black',
  headerTitleStyle: {
   fontWeight: "bold",
  }
}

export default BookBazar;