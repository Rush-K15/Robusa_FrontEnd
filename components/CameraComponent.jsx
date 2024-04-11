import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { useNavigation } from '@react-navigation/native';

const CameraComponent = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [deviceName, setDeviceName] = useState('');
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData({ type, data });
    console.log(`Scanned data type: ${type}, data: ${data}`);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo.uri);
    }
  };

  const sendData = async () => {
    const token = await AsyncStorage.getItem('token');
      
    // Extracting the data from scannedData
    const { type, data } = scannedData;
    
    const bodyData = {
      deviceName: deviceName,
      scannedData: {
        type: type,
        data: data
      }
    };
    
    fetch(config.API_URL+'/auth/devices/addnew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(bodyData),
    })
    .then(response => {
      
      return response.json();
    })
    .then(data => {
      
      console.log('Data sent successfully:', data.message);
      alert(data.message);
      navigation.navigate('Devices');
    })
    .catch(error => {
      navigation.navigate('Devices');
      console.error('There was a problem sending the data:', error);
    });
  };
  
 
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (scannedData) {
    return (
      <View style={styles.container}>
        <View style={styles.barcodeDataContainer}>
          <Text style={styles.barcodeDataText}>
            
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setDeviceName(text)}
            value={deviceName}
            placeholder="Enter Device Name"
          />
          <TouchableOpacity style={styles.addButton} onPress={sendData}>
            <Text style={styles.text}>Add Device</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
        onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  camera: {
    flex: 1,
    width: '80%',
    aspectRatio: 3 / 3,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },

  addButton:
  {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FCCE22',
    padding: 18,
    borderRadius:20,
    marginRight:120,
    marginTop:30
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FCCE22',
    padding: 18,
    borderRadius:20,
    marginLeft:140,
    marginBottom:50
  },
  text: {
    fontSize: 22,
    color: 'white',
    
    
  },
  barcodeDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
  },
  barcodeDataText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    height: 60,
    backgroundColor:'white',
    width: '80%',
    borderColor: '#FCCE22',
    borderWidth: 1,
    borderRadius:15,
    margin: 10,
    paddingHorizontal: 10,
    fontSize:18,
    color:'#323660'
  },
});

export default CameraComponent;
