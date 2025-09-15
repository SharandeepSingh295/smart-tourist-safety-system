import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [safetyStatus, setSafetyStatus] = useState('checking');
  const [riskLevel, setRiskLevel] = useState(0);
  const [nearbyThreats, setNearbyThreats] = useState([]);

  useEffect(() => {
    checkSafetyStatus();
  }, []);

  const checkSafetyStatus = async () => {
    try {
      // Mock safety check
      setTimeout(() => {
        setSafetyStatus('safe');
        setRiskLevel(25);
        setNearbyThreats([
          { id: 1, type: 'Crowded area', distance: '200m', severity: 'low' },
          { id: 2, type: 'Construction zone', distance: '500m', severity: 'medium' }
        ]);
      }, 2000);
    } catch (error) {
      console.error('Safety check error:', error);
      setSafetyStatus('error');
    }
  };

  const getSafetyColor = () => {
    if (riskLevel < 30) return '#4CAF50';
    if (riskLevel < 70) return '#FF9800';
    return '#F44336';
  };

  const handleEmergencyPress = () => {
    Alert.alert(
      'Emergency Alert',
      'Are you in immediate danger?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'YES - SEND ALERT', onPress: sendEmergencyAlert, style: 'destructive' }
      ]
    );
  };

  const sendEmergencyAlert = () => {
    Alert.alert('🚨 Emergency Alert Sent', 'Help is on the way!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Dashboard</Text>
        <Text style={styles.subtitle}>Current Status</Text>
      </View>

      {/* Safety Status Card */}
      <View style={[styles.statusCard, { borderLeftColor: getSafetyColor() }]}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>
            {safetyStatus === 'checking' ? '🔍 Analyzing...' : 
             safetyStatus === 'safe' ? '✅ Area is Safe' :
             safetyStatus === 'warning' ? '⚠️ Caution Advised' :
             '❌ Error'}
          </Text>
          <Text style={[styles.riskScore, { color: getSafetyColor() }]}>
            Risk: {riskLevel}%
          </Text>
        </View>
        <Text style={styles.statusDescription}>
          {safetyStatus === 'checking' ? 'Checking your location and surroundings...' :
           safetyStatus === 'safe' ? 'Your current area has low risk factors.' :
           'Please exercise caution in this area.'}
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

      {/* Nearby Threats */}
      <View style={styles.threatsSection}>
        <Text style={styles.sectionTitle}>Nearby Alerts</Text>
        {nearbyThreats.map(threat => (
          <View key={threat.id} style={styles.threatCard}>
            <Text style={styles.threatType}>{threat.type}</Text>
            <Text style={styles.threatDistance}>{threat.distance} away</Text>
            <View style={[styles.severityBadge, { backgroundColor: 
              threat.severity === 'low' ? '#4CAF50' :
              threat.severity === 'medium' ? '#FF9800' : '#F44336'
            }]}>
              <Text style={styles.severityText}>{threat.severity.toUpperCase()}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionEmoji}>📍</Text>
            <Text style={styles.actionText}>Share Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionEmoji}>📞</Text>
            <Text style={styles.actionText}>Emergency Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionEmoji}>🗺️</Text>
            <Text style={styles.actionText}>Safe Routes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionEmoji}>📢</Text>
            <Text style={styles.actionText}>Report Incident</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    padding: 20,
    backgroundColor: '#2E5BFF',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
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
  threatsSection: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  threatCard: {
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
  threatType: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  threatDistance: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionsSection: {
    margin: 20,
    marginTop: 0,
  },
  actionButtons: {
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
  actionEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});