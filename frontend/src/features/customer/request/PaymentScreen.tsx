import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

export function PaymentScreen() {
  const [isProcessing, setIsProcessing] = useState(false);

  const serviceDetails = {
    type: "Flatbed Towing",
    location: "Colombo 03",
    estimatedCost: "5000.00" // Formatted for PayHere
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Because you are on a Mac using the iOS Simulator, localhost routes correctly.
      const response = await fetch('http://localhost:8080/api/payment/hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: "REQ-9942", // We will make this dynamic later
          amount: parseFloat(serviceDetails.estimatedCost),
          currency: "LKR"
        })
      });

      if (!response.ok) throw new Error("Backend connection failed");

      const data = await response.json();
      console.log("Secure Hash from Spring Boot:", data.hash);
      
      Alert.alert(
        "Backend Connected!", 
        `Hash generated successfully:\n${data.hash}\n\nReady to initialize PayHere.`
      );
      
      // The next phase will be passing this hash into the actual PayHere SDK
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Connection Error", "Ensure the Spring Boot server is running on port 8080.");
    } finally {
      setIsProcessing(false);
    }
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
        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>Proceed to PayHere</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  header: { fontSize: 18, fontWeight: '700', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: '#6B7280', fontSize: 15 },
  value: { fontWeight: '500', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#000' },
  payButton: { backgroundColor: '#000', padding: 18, borderRadius: 8, alignItems: 'center' },
  payButtonDisabled: { opacity: 0.7 },
  payButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});