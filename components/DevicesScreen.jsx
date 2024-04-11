import React, { useEffect, useState, useCallback} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Alert,Image,ImageBackground, ActivityIndicator  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation , DrawerActions} from '@react-navigation/native';
import config from '../config';
import { NotificationSetup } from './RobusaNotify';

const DevicesScreen = ({ route }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const fetchDevices = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      NotificationSetup(token);
      const response = await axios.get(
        config.API_URL + `/auth/devices/getdevices`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setDevices(response.data);
    } catch (error) {
      navigation.navigate('Login');
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [])
  );

  const navigateToCamera = () => {
    navigation.navigate('Camera');
  };

  const handleDeleteDevice = async (uniqueId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        config.API_URL + '/auth/devices/delete',
        { uniqueId: uniqueId },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
      Alert.alert('Error', 'Failed to delete device. Please try again later.');
    }
  };

  const handleDevicePress = (item) => {
    if (item.deviceType === 'Lock') {
      navigation.navigate('LockSys', { uniqueId: item.uniqueId });
    } else {
      alert('Device Not Functional');
    }
  };

  const confirmDeleteDevice = (deviceId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDeleteDevice(deviceId) },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    // Show loading screen
    return (
      <View style={[styles.container, { backgroundColor: '#323660' }]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Hold up...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     
      <ImageBackground
        source={require('../assets/gray_bg.jpg')}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay} />
     
      

      {/* <Text style={styles.title}>YOUR DEVICES</Text> */}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.uniqueId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.deviceCard, { width: screenWidth - 32 }]}
            onPress={() => handleDevicePress(item)}
          >
            
            <ImageBackground
        source={require('../assets/card_bg.png')}
        style={styles.cardBackground}
        resizeMode="cover"
        
      >
        
        
            <View style={styles.deviceCardContent}>
              <View style={styles.deviceHeader}>
                <Text style={styles.deviceName}>{item.deviceName}</Text>
                <TouchableOpacity onPress={() => confirmDeleteDevice(item.uniqueId)}>
                  <Ionicons name="trash-bin" size={24} color="maroon" />
                </TouchableOpacity>
              </View>
              <View style={styles.deviceInfo}>
                <Ionicons name={item.deviceType === 'Lock' ? 'lock-closed' : 'md-phone-portrait'} size={22} color="#5A5A5A" />
                <Text style={styles.deviceType}>{item.deviceType}</Text>
              </View>
              <View style={styles.deviceInfo}>
                <Ionicons name={item.status === 'Active' ? 'checkmark-circle-outline' : 'close-circle-outline'} size={22} color={item.status === 'Active' ? 'green' : 'red'} />
                <Text style={[styles.deviceStatus, { color: item.status === 'Active' ? 'green' : 'red' }]}>{item.status}</Text>
              </View>
            </View>
            
            
            </ImageBackground>
            
          </TouchableOpacity>
          
          
        )}
        ListEmptyComponent={<Text style={styles.cameraLink}> No devices found</Text>}
      />
      <TouchableOpacity  style={styles.button} onPress={navigateToCamera}>
        <Text style={styles.cameraLink}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    padding: 16,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
  },

  cardBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adjust opacity as needed
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  deviceCard: {
    marginTop:15,
    borderRadius: 20,    
    marginBottom: 20,
    elevation: 3,
    overflow: 'hidden', // Clip child elements to the bounds of the card
    width: 0,
    
  },
  deviceCardContent: {
    padding: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceName: {
    fontFamily: 'sans-serif-medium',
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  deviceType: {
    fontSize: 15,
    color: '#5A5A5A',
    marginLeft: 8,
  },
  deviceStatus: {
    fontSize: 15,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  button: {
    backgroundColor: '#323660',
    
    borderRadius: 40,
       
   marginLeft:'80%',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height:70
  },
  cameraLink: {
    fontSize: 35,
    color: 'white',
    
    fontWeight: 'bold'
  
    
    
  },
});

export default DevicesScreen;
