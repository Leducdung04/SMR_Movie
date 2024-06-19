import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Wellcome from '../Screen/Wellcome';
import Bottomtabs from './Bottomtabs';
import Movide from '../Screen/Movide';
import Showtime from '../Screen/Showtime';
import Login from '../Screen/Login';
import Sigup from '../Screen/Sigup';
import BockTicket from '../Screen/BockTicket';

const Stack = createNativeStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Wellcome' component={Wellcome} />
        <Stack.Screen name='Bottomtabs' component={Bottomtabs} />
        <Stack.Screen name='Movide' component={Movide} />
        <Stack.Screen name='Showtime' component={Showtime} />
        <Stack.Screen name='BockTicket' component={BockTicket} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Sigup' component={Sigup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
