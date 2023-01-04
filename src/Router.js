import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {CheckIn, History, Setting} from './screens';
import {ROUTER_PATH} from './constants';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="check-in">
    <Stack.Screen
      name={ROUTER_PATH.CHECK_IN}
      component={CheckIn}
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name={ROUTER_PATH.HISTORY}
      component={History}
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name={ROUTER_PATH.SETTING}
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
