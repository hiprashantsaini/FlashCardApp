import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import AddCardScreen from './src/screen/AddCardScreen';
import LoginScreen from './src/screen/LoginScreen';
import ReviewScreen from './src/screen/ReviewScreen';
import SignupScreen from './src/screen/SignupScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Logout from './src/components/Logout';

const API_URL = 'http://192.168.109.166:8080/api';
const userId = '65f69aaea04e5d902e842278';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('login');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  // Fetch cards from the API
  const fetchCards = async (userId) => {
    try {
      if(!userData) return;
      setLoading(true);
      // const response = await axios.get(`${API_URL}/flashcards/${userId}`);
      const response = await axios.get(`${API_URL}/flashcards/${userId}`);
      setCards(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No token found');
        return;
      }
      const res = await axios.get(`${API_URL}/user`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(res.data.user);
      setActiveScreen('addCard');
    } catch (error) {
      console.error('Error fetching userData:', error);
    }
  };

  // Add a new card function to pass to AddCardScreen
  const addCard = async (front, back) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/flashcards/add`, {
        userId:userData._id,
        front,
        back
      });

      console.log('res :', res.data.message);
      // Refresh cards after adding
      await fetchCards(userData._id);
      setLoading(false);
      return true; // Success
    } catch (error) {
      console.error('Error adding card:', error);
      setLoading(false);
      return false; // Failure
    }
  };

  // User Authentication functions
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/user/login`, {
        email,
        password
      }, { withCredentials: true });

      setUserData(response.data.user);
      if(response.data.token){
        await AsyncStorage.setItem('token',response.data.token);
      }
      setActiveScreen('addCard');
      fetchCards(response.data.user._id);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/user/signup`, {
        name,
        email,
        password
      });

      // After successful signup, switch to login
      setActiveScreen('login');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch cards when component mounts
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Flashcard App</Text>

      {userData ? (
        <View style={styles.header}>
          <Text
            style={[
              styles.button,
              activeScreen === 'addCard' && styles.activeButton
            ]}
            onPress={() => setActiveScreen('addCard')}
          >
            Add Card
          </Text>
          <Text
            style={[
              styles.button,
              activeScreen === 'reviewCard' && styles.activeButton
            ]}
            onPress={() => setActiveScreen('reviewCard')}
          >
            Review Cards ({cards.length})
          </Text>
        </View>
      ) : (
        <View style={styles.header}>
          <Text
            style={[
              styles.button,
              activeScreen === 'signup' && styles.activeButton
            ]}
            onPress={() => setActiveScreen('signup')}
          >
            SignUp
          </Text>
          <Text
            style={[
              styles.button,
              activeScreen === 'login' && styles.activeButton
            ]}
            onPress={() => setActiveScreen('login')}
          >
            Login
          </Text>
        </View>
      )}

      {activeScreen === 'addCard' && (
        <AddCardScreen
          addCard={addCard}
          loading={loading}
        />
      )}

      {activeScreen === 'reviewCard' && (
        <ReviewScreen
          // userId={userId}
          userId={userData._id}
          onReviewComplete={fetchCards}
        />
      )}

      {activeScreen === 'signup' && (
        <SignupScreen
          handleSignup={handleSignup}
          loading={loading}
          switchToLogin={() => setActiveScreen('login')}
        />
      )}

      {activeScreen === 'login' && (
        <LoginScreen
          handleLogin={handleLogin}
          loading={loading}
          switchToSignup={() => setActiveScreen('signup')}
        />
      )}
      {userData && <Logout setUserData={setUserData} setActiveScreen={setActiveScreen}/>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  header: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  button: {
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 10,
    overflow: 'hidden',
    textAlign: 'center',
  },
  activeButton: {
    backgroundColor: '#0056b3',
  },
});
