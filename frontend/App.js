import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import UserScreen from './screens/UserScreen';
import HomeScreen from './screens/HomeScreen';
import FilterScreen from './screens/FilterScreen';
import CreateAdScreen from './screens/CreateAdScreen';
import ViewBookScreen from './screens/ViewBookScreen';

const Stack = createStackNavigator();

export default BookBazar => {
    return (
      <NavigationContainer>
        <StatusBar backgroundColor="lightgray" barStyle="dark-content"/>
        <Stack.Navigator
          initialrouteName="LoginScreen"
          screenOptions={screenOptions}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
               headerShown: false
            }}
          />
          <Stack.Screen
            name="User"
            component={UserScreen}
            options={{
              title: 'Cadastrar Usuário',
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'BookBazar',
            }}
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