// Import necessary modules
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import config from '../config';
import { ImageBackground } from 'react-native-web';
import Icon from 'react-native-vector-icons/FontAwesome';


// Define the LoginScreen component
const LoginScreen = () => {
  // State variables for email, password, and loading status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

 
  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };

  const handleEmailBlur = () => {
    setIsEmailFocused(false);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };
  // Get navigation object
  const navigation = useNavigation();

  // Function to handle login
  const handleLogin = async () => {
    setIsLoading(true); // Set loading to true while processing login

    try {
      // Make a POST request to the login endpoint
      const response = await fetch(config.API_URL + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Get the response as JSON
      const jsonData = await response.json();

      // Check if login was successful
      if (response.ok) {
        // Save token in AsyncStorage
        await AsyncStorage.setItem('token', jsonData.token);

        // Navigate to DevicesScreen
        navigation.navigate('Devices');
      } else {
        // Alert the user about login failure
        Alert.alert('Login Failed', jsonData.message);
      }
    } catch (error) {
      // Alert the user about the error
      Alert.alert('Login Error', 'An error occurred while logging in. Please try again later.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false); // Set loading back to false after login attempt
    }
  };

  // Function to handle navigation to sign up screen
  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  // Function to check if user is already logged in
  const checkLoginStatus = async () => {
    setIsLoading(true); // Set loading to true while checking login status

    try {
      // Make a POST request to check if user is logged in
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(config.API_URL + '/auth/checkLogin', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      // Check if response is ok
      if (response.ok) {
        // Navigate to DevicesScreen if user is logged in
        navigation.navigate('Devices');
      }
    } catch (error) {
      // Log any errors
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false); // Set loading back to false after checking login status
    }
  };

  // Call checkLoginStatus function when component is rendered
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Render the component
  return (


    // <ImageBackground
    //   source={require('../assets/mybg.jpg')}
    //   style={styles.background}
    // >
   

      <View style={styles.container}>
        
         <Image
        source={require('../assets/mybg.png')}
        style={StyleSheet.absoluteFillObject}
      />
      
        <Image
          source={require('../assets/logo.png')} // Example: Import your logo image
          style={styles.logo}
        />
        <Text style={styles.title}>IoT Solutions</Text>

        <View style={styles.userContainer}>
        

        <View style={[styles.inputContainer, isEmailFocused && styles.focusedInput]}>
          <Icon name="envelope" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={[styles.input, { borderColor: isEmailFocused ? '#FCCE22' : 'transparent' }]}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={[styles.inputContainer, isPasswordFocused && styles.focusedInput]}>
          <Icon name="lock" size={20} color="#666" style={styles.icon} />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={[styles.input, { borderColor: isPasswordFocused ? '#FCCE22' : 'transparent' }]}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            underlineColorAndroid="transparent"
          />

        </View>
        <TouchableOpacity >
          <Text style={[styles.forgotPasswordText]}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
        
      </View>

      </View>
      //  {/* </ImageBackground> */}
    


  );
};
const { height } = Dimensions.get('window');
// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 20,


  },



  userContainer: {
  marginBottom:'-70%',
   
  width:'90%',
  backgroundColor:'white',
  borderRadius:20,
  display:'flex',
  justifyContent:'center',
  borderWidth:4,
  borderColor:'#FCCE22'

  },
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
    justifyContent: 'center',
  },
  title: {
    fontFamily:'sans-serif-light',
    fontSize: 50,
    fontWeight: '500',
    // paddingVertical:30,
    color: '#323660',
    marginBottom: 90
  },

  logo: {
    width: 200,
    height: 200,
    marginTop: -150,
    
    resizeMode: 'contain',

    justifyContent: 'center',


  },

  inputContainer: {
   
    
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    // borderWidth: 1,
   
    borderRadius: 50,
    paddingHorizontal: 30,
    backgroundColor: '#f9f9f9',
    height:50,
    borderBottomWidth:4 ,
    fontSize: 16,

    // borderColor: '#323660',

  },
  input: {
    // width: '80%',
    // height: 50,
    // borderWidth: 1,
    // borderRadius: 50,
    // borderColor: '#323660',
    // borderBottomWidth: 5,
    // backgroundColor: '#f9f9f9',
    // marginBottom: 30,

    // paddingHorizontal: 15,
   
   
    // color: '#333333',

    flex: 1,
    height: 40,
    marginLeft: 10,
   
  
  },




  focusedInput: {
    borderColor: '#FCCE22',
    borderWidth: 2,
  },
  loginButton: {
    backgroundColor: '#323660',
    padding: 10,
    borderRadius: 50,
    marginVertical: 20,
    marginLeft:40,
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 250
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  forgotPasswordText: {
    marginTop:-8,
    marginLeft:180,
    fontSize: 14,
    color: '#FCCE22',
    textAlign: 'center',
    textDecorationLine: 'underline',

  },
  signupText: {
    marginTop: 5,
    marginLeft:60,
    color: '#FCCE22',
    textDecorationLine: 'underline',
    marginBottom:25
  },
});

// Export the component
export default LoginScreen;