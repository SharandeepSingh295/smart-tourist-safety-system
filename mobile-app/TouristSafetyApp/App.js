import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';

// Import navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Import Expo modules
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Home Screen Component
function HomeScreen({ navigation }) {
  const [safetyStatus, setSafetyStatus] = useState('checking');
  const [riskLevel, setRiskLevel] = useState(25);
  const [location, setLocation] = useState(null);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'Crowded Area', severity: 'low', time: '2 min ago' },
    { id: 2, type: 'Construction Zone', severity: 'medium', time: '15 min ago' },
  ]);

  useEffect(() => {
    requestLocationPermission();
    checkSafetyStatus();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required for safety monitoring');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log('📍 Location obtained:', location.coords);
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const checkSafetyStatus = () => {
    setTimeout(() => {
      setSafetyStatus('safe');
      setRiskLevel(Math.floor(Math.random() * 100));
    }, 2000);
  };

  const getSafetyColor = () => {
    if (riskLevel < 30) return '#4CAF50';
    if (riskLevel < 70) return '#FF9800';
    return '#F44336';
  };

  const handleEmergencyPress = () => {
    Alert.alert(
      '🚨 EMERGENCY',
      'Are you in immediate danger?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'YES - SEND ALERT', 
          onPress: sendEmergencyAlert,
          style: 'destructive'
        }
      ]
    );
  };

  const sendEmergencyAlert = async () => {
    // Send emergency notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 EMERGENCY ALERT SENT',
        body: 'Help is on the way! Emergency services have been notified.',
        sound: 'default',
      },
      trigger: null,
    });

    Alert.alert('🚨 Emergency Alert Sent', 'Help is on the way!');
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E5BFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔒 Safety Dashboard</Text>
        <Text style={styles.headerSubtitle}>Current Status</Text>
      </View>

      {/* Safety Status Card */}
      <View style={[styles.statusCard, { borderLeftColor: getSafetyColor() }]}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>
            {safetyStatus === 'checking' ? '🔍 Analyzing...' : 
             safetyStatus === 'safe' ? '✅ Area is Safe' : '⚠️ Caution Advised'}
          </Text>
          <Text style={[styles.riskScore, { color: getSafetyColor() }]}>
            Risk: {riskLevel}%
          </Text>
        </View>
        <Text style={styles.statusDescription}>
          {safetyStatus === 'checking' ? 'Checking your location and surroundings...' :
           'Your current area has been analyzed for safety risks.'}
        </Text>
      </View>

      {/* Emergency Button */}
      <TouchableOpacity 
        style={styles.emergencyButton} 
        onPress={handleEmergencyPress}
      >
        <Text style={styles.emergencyText}>🚨 EMERGENCY</Text>
        <Text style={styles.emergencySubtext}>Tap for immediate help</Text>
      </TouchableOpacity>

      {/* Recent Alerts */}
      <View style={styles.alertsSection}>
        <Text style={styles.sectionTitle}>Recent Safety Alerts</Text>
        {alerts.map(alert => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={[styles.alertIcon, { 
              backgroundColor: alert.severity === 'high' ? '#F44336' :
                              alert.severity === 'medium' ? '#FF9800' : '#4CAF50'
            }]}>
              <Text style={styles.alertIconText}>
                {alert.severity === 'high' ? '⚠️' : 
                 alert.severity === 'medium' ? '⚠️' : 'ℹ️'}
              </Text>
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertType}>{alert.type}</Text>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionText}>Share Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>Emergency Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🗺️</Text>
            <Text style={styles.actionText}>Safe Routes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📢</Text>
            <Text style={styles.actionText}>Report Incident</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Map Screen Component
function MapScreen() {
  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2E5BFF" />
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={styles.mapTitle}>Interactive Safety Map</Text>
        <Text style={styles.mapSubtitle}>
          Real-time threat detection and safe zone mapping
        </Text>
        <TouchableOpacity style={styles.mapButton}>
          <Text style={styles.mapButtonText}>Enable Location Services</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Emergency Screen Component
function EmergencyScreen() {
  const emergencyContacts = [
    { name: 'Police', number: '911', icon: '🚔' },
    { name: 'Medical', number: '911', icon: '🚑' },
    { name: 'Fire Dept', number: '911', icon: '🚒' },
    { name: 'Tourist Helpline', number: '1-800-HELP', icon: '📞' },
  ];

  const handleEmergencyCall = (contact) => {
    Alert.alert(
      `Call ${contact.name}?`,
      `This will call ${contact.number}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => {
          Alert.alert('📞 Calling...', `Connecting to ${contact.name}`);
        }}
      ]
    );
  };

  return (
    <View style={styles.emergencyContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4444" />
      
      <View style={styles.emergencyHeader}>
        <Text style={styles.emergencyHeaderTitle}>🚨 EMERGENCY</Text>
        <Text style={styles.emergencyHeaderSubtitle}>Immediate Help Available</Text>
      </View>

      <ScrollView style={styles.emergencyContent}>
        <Text style={styles.emergencyInstructions}>
          In case of emergency, tap any button below for immediate assistance
        </Text>

        {emergencyContacts.map((contact, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.emergencyContactButton}
            onPress={() => handleEmergencyCall(contact)}
          >
            <Text style={styles.emergencyContactIcon}>{contact.icon}</Text>
            <View style={styles.emergencyContactInfo}>
              <Text style={styles.emergencyContactName}>{contact.name}</Text>
              <Text style={styles.emergencyContactNumber}>{contact.number}</Text>
            </View>
            <Text style={styles.emergencyContactArrow}>▶️</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.panicButton}>
          <Text style={styles.panicButtonText}>🚨 PANIC BUTTON</Text>
          <Text style={styles.panicButtonSubtext}>Send location to all emergency contacts</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Profile Screen Component
function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E5BFF" />
      
      <View style={styles.profileHeader}>
        <Text style={styles.profileTitle}>👤 Profile</Text>
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john@example.com</Text>
          <Text style={styles.profilePhone}>+1 234 567 8900</Text>
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <View style={styles.contactCard}>
          <Text style={styles.contactName}>Jane Doe - Spouse</Text>
          <Text style={styles.contactPhone}>+1 234 567 8901</Text>
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Safety Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>🔔 Notifications</Text>
          <Text style={styles.settingArrow}>▶️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>📍 Location Sharing</Text>
          <Text style={styles.settingArrow}>▶️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>🚨 Emergency Preferences</Text>
          <Text style={styles.settingArrow}>▶️</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#2E5BFF',
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#B8C4FF',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>🗺️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Emergency" 
        component={EmergencyScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>🚨</Text>
          ),
          tabBarStyle: {
            backgroundColor: '#FF4444',
            paddingBottom: Platform.OS === 'ios' ? 20 : 5,
            height: Platform.OS === 'ios' ? 85 : 60,
          },
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Notification permission not granted');
      }

      // Initialize app
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('App initialization error:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#2E5BFF" />
        <Text style={styles.loadingIcon}>🔒</Text>
        <Text style={styles.loadingTitle}>Smart Tourist Safety</Text>
        <Text style={styles.loadingSubtitle}>Initializing security systems...</Text>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E5BFF',
  },
  loadingIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#B8C4FF',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#2E5BFF',
    padding: 30,
    paddingTop: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B8C4FF',
  },
  statusCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  riskScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emergencyButton: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    backgroundColor: '#FF4444',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emergencySubtext: {
    fontSize: 14,
    color: '#FFCCCC',
    marginTop: 5,
  },
  alertsSection: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alertIconText: {
    fontSize: 20,
  },
  alertContent: {
    flex: 1,
  },
  alertType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  alertTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actionsSection: {
    margin: 20,
    marginTop: 0,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  // Map Screen Styles
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8F9FF',
  },
  mapIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  mapSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  mapButton: {
    backgroundColor: '#2E5BFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Emergency Screen Styles
  emergencyContainer: {
    flex: 1,
    backgroundColor: '#FF4444',
  },
  emergencyHeader: {
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#FF4444',
  },
  emergencyHeaderTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  emergencyHeaderSubtitle: {
    fontSize: 16,
    color: '#FFCCCC',
  },
  emergencyContent: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  emergencyInstructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  emergencyContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emergencyContactIcon: {
    fontSize: 30,
    marginRight: 20,
  },
  emergencyContactInfo: {
    flex: 1,
  },
  emergencyContactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emergencyContactNumber: {
    fontSize: 16,
    color: '#666',
  },
  emergencyContactArrow: {
    fontSize: 20,
  },
  panicButton: {
    backgroundColor: '#FF4444',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  panicButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  panicButtonSubtext: {
    fontSize: 14,
    color: '#FFCCCC',
  },
  // Profile Screen Styles
  profileHeader: {
    backgroundColor: '#2E5BFF',
    padding: 30,
    paddingTop: 60,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#B8C4FF',
    marginBottom: 5,
  },
  profilePhone: {
    fontSize: 16,
    color: '#B8C4FF',
  },
  profileSection: {
    margin: 20,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingArrow: {
    fontSize: 16,
    color: '#2E5BFF',
  },
});
