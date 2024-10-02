import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const Club = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5', 
  },
  text: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333', 
  },
});

export default Club;
