import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  // CardStyleInterpolators,
} from '@react-navigation/stack';
import {CheckIn, History, Setting} from './screens';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();
// import {routerPath} from './src/Constant/routerPath';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Tab.Navigator
    initialRouteName="check-in"
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
      // cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
    }}>
    <Tab.Screen
      name="check-in"
      component={CheckIn}
      options={{
        headerShown: false,
        // cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        gestureEnabled: false,
      }}
    />
    <Tab.Screen
      name="history"
      component={History}
      options={{
        headerShown: false,
        // cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        gestureEnabled: false,
      }}
    />
    <Tab.Screen
      name="setting"
      component={Setting}
      options={{
        headerShown: false,
        // cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        gestureEnabled: false,
      }}
    />
  </Tab.Navigator>
);

export default () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);
