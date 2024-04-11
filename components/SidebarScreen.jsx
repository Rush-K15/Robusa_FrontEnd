import React from 'react';
import { View, Text, Button, StyleSheet,route,param, TouchableOpacity,ImageBackground ,Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SidebarScreen = () => {
  const navigation = useNavigation();

  const navigateToProfile = () => {
    // Navigate to profile screen
    // You need to define your profile screen in your navigation stack
    navigation.navigate('Profile');
  };

  const navigateToDevices = () => {
    // Navigate to devices screen
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const navigateToSupport = () => {
    // Navigate to support screen
    // You need to define your support screen in your navigation stack
    navigation.navigate('HelpDesk');
  };
  const navigateToSecurity = () => {
    // Navigate to support screen
    // You need to define your support screen in your navigation stack
    navigation.navigate('Security');
  }

  const handleLogout = async () => {
    // Clear user token or any other user data from async storage
    try {
      await AsyncStorage.removeItem('token');
      // Navigate to login screen or any other screen that needs to be shown after logout
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
   
    <View style={styles.container}>
        {/* <ImageBackground
        source={require('../assets/gray_bg.jpg')}
        style={StyleSheet.absoluteFillObject}
      /> */}
      {/* <View style={styles.overlay} /> */}
      <Text style={styles.headerText}>Robusa</Text>
        <View style={styles.horizontalLine} />
       
      <TouchableOpacity style={styles.button} onPress={navigateToProfile}>
        <Ionicons name="person-circle" size={24} color="#323660" />
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToDevices}>
        <Ionicons name="hardware-chip" size={24} color="#323660" />
        <Text style={styles.buttonText}>Devices</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToSecurity}>
        <Ionicons name="key" size={24} color="#323660" />
        <Text style={styles.buttonText}>Security</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={navigateToSupport}>
        <Ionicons name="help-circle" size={24} color="#323660" />
        <Text style={styles.buttonText}>HelpDesk</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#323660" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
    
    
  );
};

const styles = StyleSheet.create({

    // backgroundImage: {
    // flex: 1,
    // resizeMode: 'cover', // or 'stretch'
    // },

    // overlay: {
    //     ...StyleSheet.absoluteFillObject,
    //     backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust opacity as needed
    //   },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
   
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:-20,
    marginBottom: 20,
    marginTop:10,
    paddingVertical: 10, // Add padding to top and bottom
    paddingHorizontal: 20, // Add padding to left and right
    // borderRadius: 20, // Add border radius for rounded corners
    // borderWidth: 1, // Add border width
    // borderColor: '#323660', // Add border color
    
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color:'#323660'
  },
  headerText: {
    marginTop:20,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#323660'
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1.5,
    marginBottom: 10,
    marginTop:10,
    width: '100%',
  },
});

export default SidebarScreen;
