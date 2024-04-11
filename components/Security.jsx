import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Security = () => {
  const [pin, setPin] = useState(generateRandomPin());
  const [showPin, setShowPin] = useState(false);
  const [validity, setValidity] = useState(7);

  // Function to generate a random 4-digit pin
  function generateRandomPin() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Function to handle pin visibility toggle
  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  // Function to handle pin regeneration
  const regeneratePin = () => {
    setPin(generateRandomPin());
    setValidity(7);
  };

  // Function to format validity display
  const formatValidity = () => {
    if (validity === 0) {
      return <Text style={styles.expiredText}>Pin expired</Text>;
    }
    return <Text style={styles.validText}>{validity} days left</Text>;
  };

  // Function to decrease validity
  const decreaseValidity = () => {
    if (validity > 0) {
      setValidity(validity - 1);
    }
  };

  return (
    <View style={styles.container}>
        <ImageBackground
        source={require('../assets/gray_bg.jpg')}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay} />
      <Text style={styles.label}>Security PIN</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={pin}
          editable={false}
          secureTextEntry={!showPin}
          
        />
        <TouchableOpacity onPress={togglePinVisibility} style={styles.eyeIcon}>
          <Ionicons name={showPin ? 'eye-off' : 'eye'} size={24} color="white" />
        </TouchableOpacity>
        
      </View>
      
      <View style={styles.validityContainer}>
        <Text style={styles.validityLabel}>Validity:</Text>
        {formatValidity()}
      </View>
      <TouchableOpacity onPress={regeneratePin} style={styles.generateButton}>
        <Text style={styles.buttonText}>GET NEW PIN</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Note: You will be notified only upon entering the correct PIN</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adjust opacity as needed
  },
  label: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#FCCE22'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
    width:250
    
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 20,
    backgroundColor:'gray',

    color:'white',
    
  },
  eyeIcon: {
    padding: 5,
    position: 'absolute',
    right: 10,
  },
  generateButton: {
    
    backgroundColor: '#323660',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop:30
    
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  validityLabel: {
    marginVertical:10,
    marginRight: 5,
    color:'white'
    
  },

  validText: {
    color: 'green',
  },
  expiredText: {
    color: 'red',
  },
  note: {
    position: 'absolute',
    bottom: 30, // Adjust this value to set the distance from the bottom
    left: 0,
    right: 0,
    fontSize: 14,
    color:'white',
    fontStyle: 'italic',
    textAlign: 'center', // Center the text horizontally
  }
});

export default Security;
