import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import FilterScreen from './screens/FilterScreen';
import CreateAdScreen from './screens/CreateAdScreen';

const Stack = createStackNavigator();

export default BookBazar => {
    return (
        <NavigationContainer>
          <Stack.Navigator initialrouteName="HomeScreen">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen
              name="Filter"
              component={FilterScreen}
            />
            <Stack.Screen
              name="Anunciar Livro"
              component={CreateAdScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
    );
}