import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import LeafletMap from './src/services/location/LeafletMap'; // Adjust path if needed

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <LeafletMap />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});