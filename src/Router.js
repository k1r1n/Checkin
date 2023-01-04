import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {CheckIn, History, Setting} from './screens';
// import {routerPath} from './src/Constant/routerPath';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="check-in">
    <Stack.Screen
      name="check-in"
      component={CheckIn}
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name="history"
      component={History}
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name="setting"
      component={Setting}
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
    />
  </Stack.Navigator>
);

export default () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);
