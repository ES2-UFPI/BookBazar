import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import FilterScreen from './screens/FilterScreen';
import CreateAdScreen from './screens/CreateAdScreen';
import ViewBookScreen from './screens/ViewBookScreen';

const Stack = createStackNavigator();

export default BookBazar => {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialrouteName="HomeScreen"
          screenOptions={screenOptions}>
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