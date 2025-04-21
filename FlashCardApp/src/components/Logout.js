import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

const Logout = ({ setUserData ,setActiveScreen}) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // ⬅️ Remove token
      console.log('Token removed');
      Alert.alert('Logged out', 'You have been successfully logged out.');
      setUserData(null);
      setActiveScreen('login');
    } catch (error) {
      console.log('Logout Error:', error);
      Alert.alert('Error', 'Something went wrong during logout.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Are you sure you want to logout?</Text>
      <Button title="Logout" onPress={handleLogout} color="#d9534f" />
    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
  },
});
