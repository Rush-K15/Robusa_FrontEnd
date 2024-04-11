// SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput,TouchableOpacity, Button,Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';


const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
   const [isNameFocused, setIsNameFocused] = useState(false);
   const [isPasswordFocused, setIsPasswordFocused] = useState(false);
   const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  

   const handleFocus = (inputName) => {
       setIsFocused(true);
       if (inputName === 'email') {
         setIsEmailFocused(true);
       } else if (inputName === 'name') {
         setIsNameFocused(true);
       } else if (inputName === 'password') {
         setIsPasswordFocused(true);
       } else if (inputName === 'confirmPassword') {
         setIsConfirmPasswordFocused(true);
       }
      };
    
      const handleBlur = (inputName) => {
       setIsFocused(false);
       if (inputName === 'email') {
         setIsEmailFocused(false);
       } else if (inputName === 'name') {
         setIsNameFocused(false);
       } else if (inputName === 'password') {
         setIsPasswordFocused(false);
       } else if (inputName === 'confirmPassword') {
         setIsConfirmPasswordFocused(false);
       }
      };

  const handleSignup = async () => {
    try {
      // Check if password and confirm password match
      if (password !== confirmPassword) {
        setPasswordMatchError('Password and Confirm Password do not match');
        return;
      }

      // Clear any previous password match error
      setPasswordMatchError('');

      // Make a POST request to the signup endpoint
      const response = await axios.post('http://192.168.1.204:3000/auth/signup', {
        email,
        name,
        password,
      });

      // Handle successful signup (e.g., navigate to login screen)
      console.log('Signup successful:', response.data);
      navigation.navigate('Login');
    } catch (error) {
      // Handle signup error
      console.error('Signup error:', error);

      // Show a user-friendly error popup
      let errorMessage = 'An error occurred during signup. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/signupbg.png')}
        style={StyleSheet.absoluteFillObject}
      />
      {/* <Text style={styles.text}>Signup</Text>
      <Text style={styles.subtext}>Join Us and Take Control !</Text> */}


<View style={styles.userContainer}>
<TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={[styles.input, { borderColor: isNameFocused ? '#FCCE22' : 'gray' }]}
        onFocus={() => handleFocus('name')}
        onBlur={() => handleBlur('name')}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={[styles.input, { borderColor: isEmailFocused ? '#FCCE22' : 'gray' }]}
        onFocus={() => handleFocus('email')}
        onBlur={() => handleBlur('email')}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={[styles.input, { borderColor: isPasswordFocused ? '#FCCE22' : 'gray' }]}
        onFocus={() => handleFocus('password')}
        onBlur={() => handleBlur('password')}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
        style={[styles.input, { borderColor: isConfirmPasswordFocused ? '#FCCE22' : 'gray' }]}
        onFocus={() => handleFocus('confirmPassword')}
  onBlur={() => handleBlur('confirmPassword')}
      />

      {/* Display password match error message */}
      {passwordMatchError ? (
        <Text style={styles.errorMessage}>{passwordMatchError}</Text>
      ) : null}

<TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
     
    </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100
    
    
  },

  inputFocused: {
    borderColor: '#FCCE22',
  },

  
  userContainer: {
    marginBottom:'-80%',     
    width:'90%',
    backgroundColor:'#E8E8E8',
    paddingTop:40,
    borderRadius:50,
    borderColor: '#FCCE22',
    borderWidth: 3,
    // display:'flex',
    // justifyContent:'center',
  
    },
  input: {
    width: '80%',
    height: 50,
   
    
    borderWidth: 1,
    borderRadius: 20,
    borderBottomWidth: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 30,
    paddingHorizontal: 25,
    fontSize: 16,
    color: '#333333',
    marginLeft:25
    
  },
  button: {
    backgroundColor: '#323660',
    padding: 15,
    borderRadius: 50,
    marginVertical: 20,
    
    marginLeft:'15%',
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
  subtext: {
    marginTop: -25,
    fontFamily: 'Roboto',
    marginBottom: 60,
    fontSize: 26,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#323660',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  text: {
    fontFamily: 'sans-serif-medium',
    fontSize: 50,
    fontWeight: '500',
    color: '#FCCE22',
    marginBottom: 35,
  },
});

export default SignupScreen;
