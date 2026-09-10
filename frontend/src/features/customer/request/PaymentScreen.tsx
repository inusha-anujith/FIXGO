import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function PaymentScreen() {
  // Temporary mock data. Later, this will be passed down from the Map screen.
  const serviceDetails = {
    type: "Flatbed Towing",
    location: "Colombo 03",
    estimatedCost: "5,000.00"
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Order Summary</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Service:</Text>
          <Text style={styles.value}>{serviceDetails.type}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{serviceDetails.location}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total (LKR):</Text>
          <Text style={styles.totalValue}>Rs. {serviceDetails.estimatedCost}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.payButton}
        onPress={() => console.log("Initializing PayHere...")}
      >
        <Text style={styles.payButtonText}>Proceed to PayHere</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background to make the white card pop
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: '#6B7280',
    fontSize: 15,
  },
  value: {
    fontWeight: '500',
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  payButton: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});