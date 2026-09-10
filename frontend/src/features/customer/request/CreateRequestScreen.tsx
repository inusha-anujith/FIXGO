import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CustomerStackParamList } from '../../../navigation/types';
import LeafletMap from '../../../services/location/LeafletMap';

export function CreateRequestScreen() {
  // This hook gives us access to the router
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();

  return (
    <View style={styles.container}>
      {/* The map takes up the remaining screen space */}
      <View style={styles.mapContainer}>
        <LeafletMap />
      </View>

      {/* The action button at the bottom */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Payment')}
      >
        <Text style={styles.buttonText}>Confirm Location & Pay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1, 
  },
  button: {
    backgroundColor: '#000', 
    padding: 18,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});