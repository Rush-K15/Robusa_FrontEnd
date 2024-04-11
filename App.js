import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DevicesScreen from './components/DevicesScreen';
import Home from './components/Home';
import LoginScreen from './components/LoginScreen';
import CameraComponent from './components/CameraComponent';
import LockSys from './components/LockSys';
import SignupScreen from './components/SignupScreen';
import SidebarScreen from './components/SidebarScreen';
import Security from './components/Security';
import Profile from './components/Profile';
import HelpDesk from './components/HelpDesk';



const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Devices" component={DevicesNavigator} />
        <Stack.Screen name="Camera" component={CameraComponent} />
        <Stack.Screen name="LockSys" component={LockSys} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Security" component={Security} options={{ headerLeft: null }}  />
        <Stack.Screen name="Profile" component={Profile} options={{ headerLeft: null }}  />
        <Stack.Screen name="HelpDesk" component={HelpDesk} options={{ headerLeft: null }}  />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const DevicesNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={() => <SidebarScreen />}>
      <Drawer.Screen name="Devices" component={DevicesScreen} />
    </Drawer.Navigator>
  );
}

export default App;
