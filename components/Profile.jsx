import React from 'react';
import { View, StyleSheet,Text } from 'react-native';

const Profile = () => {
  return (
    <View style={styles.container}>
     <Text style={styles.text}>Coming Soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent:'center',
    alignItems:'center'
  },

  text:
  {
    fontSize:25,
    color:'#323660',
    fontFamily:'sans-serif'
  }
});

export default Profile;
