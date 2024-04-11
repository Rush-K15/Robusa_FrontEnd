import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Button ,ImageBackground} from 'react-native';
import CircularProgressComponent from './CircularProgressComponent';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { deviceName, deviceType } from 'expo-device';

const LockSys = ({ route }) => {
  const navigation = useNavigation();
  const { uniqueId } = route.params;
  const [buttonColor, setButtonColor] = useState('red');
  const [online, setOnline] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [status, setStatus] = useState('Hold to Communicate');
  const [lockImage, setLockImage] = useState(require('./images/locked.png'));
  const [unlockImage, setUnlockImage] = useState(require('./images/unlocked.png'));
  const [errorImage, setErrorImage] = useState(require('./images/error.png'));
  const isButtonHeldRef = useRef(false);
  const timerIdRef = useRef(null);
  const [press, setPress] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [communicationApi, setCommunicationApi] = useState();
  const [pin, setPin] = useState('');
  const [validity, setValidity] = useState('3:00'); // Initial validity time

  useEffect(() => {
    fetchCommunicationApi();
    if (showProgress) {
      const timeoutId = setTimeout(() => {
        setShowProgress(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [showProgress]);

  const fetchCommunicationApi = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        config.API_URL + `/auth/devices/getCommunicationApi`,
        { uniqueId: uniqueId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setCommunicationApi(response.data.communicationApi);
    } catch (error) {
      navigation.navigate('Devices');
      alert('Power Device and wait for it to register itself');
      console.log(error);
    }
  };

  const generatePin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        config.API_URL + `/auth/devices/generatePin`,
        { uniqueId: uniqueId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPin(response.data.pin);
  
      // Reset the timer to 3 minutes
      let secondsLeft = 180;
      setValidity(formatTime(secondsLeft));
  
      clearInterval(timerIdRef.current);
      timerIdRef.current = setInterval(() => {
        secondsLeft--;
        if (secondsLeft === 0) {
          clearInterval(timerIdRef.current);
          setValidity('Expired');
        } else {
          setValidity(formatTime(secondsLeft));
        }
      }, 1000);
    } catch (error) {
      console.error('Error generating PIN:', error);
      alert('Error generating PIN. Please try again.');
    }
  };
  
  const formatTime = (seconds) => {
    if (seconds <= 0) {
      return 'Expired';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  

  useEffect(() => {
    return () => clearInterval(timerIdRef.current);
  }, []);

 

  // Function to handle press in event
  const handlePressIn = async () => {
    isButtonHeldRef.current = true;
    buttonColor === 'green' ? setStatus('Hold to Lock') : setStatus('Hold to Unlock');
    setPress(true);
    setShowProgress(true);

    timerIdRef.current = setTimeout(() => {
      if (isButtonHeldRef.current) {
        console.log(communicationApi + '/1');
        const apiUrl =
          buttonColor === 'green' ? communicationApi + '/1' : communicationApi + '/2';

        const action = buttonColor === 'green' ? 'LOCK' : 'UNLOCK';

        sendRequest(apiUrl, action);
      }
    }, 3000);
  };

  // Function to handle press out event
  const handlePressOut = () => {
    isButtonHeldRef.current = false;
    clearTimeout(timerIdRef.current);

    setPress(false);

    setShowProgress(false);
    if (online === false) {
      setStatus('Offline');
    }
  };

  // Function to send request to lock or unlock
  const sendRequest = async (url, action) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      console.log('HEKKI:', response);
      console.log(response);
      if (response.ok) {
        console.log(response);
        const responseData = await response.text();
        setApiResponse(responseData);
        setOnline(true);
        if (responseData === 'ON' && action === 'LOCK') {
          setButtonColor('red');
          setStatus('Currently Locked');
        } else if (responseData === 'OFF' && action === 'UNLOCK') {
          setButtonColor('green');
          setStatus('Currently Unlocked');
        } else {
          setButtonColor('yellow');
          setOnline(false);
          setStatus('Offline');
        }
      } else {
        console.error('Request failed');
        setButtonColor('yellow');
        setOnline(false);
        setStatus('Offline');
      }
    } catch (error) {
      console.error('Error during request:', error);
      setOnline(false);
      setButtonColor('yellow');
      setStatus('Offline');
    }
  };

  const handleCardClick = () => {
    console.log('Card clicked');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/gray_bg.jpg')}
        style={StyleSheet.absoluteFillObject}
      />
   <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {showProgress && (
          <View style={styles.circularProgressContainer}>
            <CircularProgressComponent percentage={100} buttonColor={buttonColor} />
          </View>
        )}

        <Text style={styles.statusBar}>{status}</Text>
        <TouchableOpacity
          style={[styles.circleButton, { backgroundColor: buttonColor }]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}>
          <Image
            source={
              buttonColor === 'yellow'
                ? errorImage
                : buttonColor === 'green'
                ? unlockImage
                : lockImage
            }
            style={styles.image}
          />
        </TouchableOpacity>
      
      </ScrollView>

      <TouchableOpacity onPress={handleCardClick} style={styles.cardContainer}>
      <Text style={styles.headerText}>DIRECT PASSKEY</Text>
      <TouchableOpacity onPress={generatePin} style={styles.generateButton}>
        <Text style={styles.buttonText}>GET PIN</Text>
      </TouchableOpacity>
      <Text style={styles.pinText}>{pin ? ` ${pin}` : ''}</Text>       
      <Text style={styles.validityText}>{pin ? `VALIDITY : ${validity}` : ''}</Text>       
      <Text style={styles.noteText}>Note: Entering correct PIN will open the box.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -110 }],
  },
  circleButton: {
    position: 'relative',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 0,
    borderColor: 'white',
    backgroundColor: 'red',
    shadowColor: '#000',
    transform: [{ translateY: 20 }],
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 18,
  },
  image: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -75 }],
  },
  statusBar: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContainer: {
    height: '25%',
    width: '90%',
    backgroundColor: '#454545',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pinText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#39FF14',
  },
  generateButton: {
    backgroundColor: '#FCCE22',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop:15
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: -20
  },
  validityText: {
    color: 'red',
  },
  noteText: {
    color: 'white',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default LockSys;

