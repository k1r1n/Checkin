import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {CheckIn, History, Setting} from './screens';
import {ROUTER_PATH} from './constants';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName={ROUTER_PATH.CHECK_IN}
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
      cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
    }}>
    <Stack.Screen name={ROUTER_PATH.CHECK_IN} component={CheckIn} />
    <Stack.Screen name={ROUTER_PATH.HISTORY} component={History} />
    <Stack.Screen name={ROUTER_PATH.SETTING} component={Setting} />
  </Stack.Navigator>
);

export default () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);
