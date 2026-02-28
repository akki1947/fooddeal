import { useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const BACKEND_URL = 'https://fooddeal-backend.onrender.com';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    
    try {
      const response = await fetch(`${BACKEND_URL}/search?query=${searchText}`);
      const data = await response.json();
      setResults(data.results);
      setSearched(true);
    } catch (e) {
      setError('Could not connect to server. Make sure backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const getBestDeal = () => {
    if (results.length === 0) return null;
    return results.reduce((best, current) =>
      (current.price + current.delivery_fee) < (best.price + best.delivery_fee) ? current : best
    , results[0]);
  };

  const best = getBestDeal();

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>🍕 FoodDeal</Text>
        <Text style={styles.subText}>Best food deals in Bangalore</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food... e.g. Pizza, Burger"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e23744" />
          <Text style={styles.loadingText}>Finding best deals...</Text>
        </View>
      )}

      {/* Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Results */}
      <ScrollView style={styles.resultsContainer}>
        {searched && results.length > 0 && (
          <>
            <Text style={styles.resultsTitle}>Best deals for "{searchText}"</Text>
            {results.map((item, index) => {
              const isBest = best && item.platform === best.platform;
              return (
                <View key={index} style={[styles.card, isBest && styles.bestCard]}>
                  {isBest && <Text style={styles.bestBadge}>🏆 BEST DEAL</Text>}
                  <Text style={styles.platformName}>{item.platform}</Text>
                  <Text style={styles.itemName}>{item.item}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{item.price}</Text>
                    <Text style={styles.deliveryFee}>+ ₹{item.delivery_fee} delivery</Text>
                    <Text style={styles.total}>= ₹{item.price + item.delivery_fee} total</Text>
                  </View>
                  <Text style={styles.deliveryTime}>🕐 {item.delivery_time} mins</Text>
                  <TouchableOpacity
                    style={[styles.orderButton, isBest && styles.bestOrderButton]}
                    onPress={() => Linking.openURL(item.url)}
                  >
                    <Text style={[styles.orderButtonText, isBest && styles.bestOrderButtonText]}>
                      Order on {item.platform} →
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#e23744',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerText: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subText: { fontSize: 14, color: 'white', marginTop: 4 },
  searchContainer: { flexDirection: 'row', margin: 16, gap: 10 },
  searchInput: {
    flex: 1, backgroundColor: 'white', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, elevation: 2,
  },
  searchButton: {
    backgroundColor: '#e23744', borderRadius: 10,
    paddingHorizontal: 20, paddingVertical: 12, justifyContent: 'center', elevation: 2,
  },
  searchButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  loadingContainer: { alignItems: 'center', marginTop: 40 },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', margin: 16 },
  resultsContainer: { flex: 1, paddingHorizontal: 16 },
  resultsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#333' },
  card: {
    backgroundColor: 'white', borderRadius: 12, padding: 16,
    marginBottom: 12, elevation: 3,
  },
  bestCard: { borderWidth: 2, borderColor: '#e23744' },
  bestBadge: { fontSize: 12, fontWeight: 'bold', color: '#e23744', marginBottom: 6 },
  platformName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  itemName: { fontSize: 14, color: '#666', marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  deliveryFee: { fontSize: 12, color: '#999' },
  total: { fontSize: 14, fontWeight: '600', color: '#e23744' },
  deliveryTime: { fontSize: 13, color: '#666', marginTop: 6 },
  orderButton: {
    backgroundColor: '#f0f0f0', borderRadius: 8,
    padding: 12, marginTop: 12, alignItems: 'center',
  },
  bestOrderButton: { backgroundColor: '#e23744' },
  orderButtonText: { fontWeight: 'bold', color: '#333' },
  bestOrderButtonText: { color: 'white' },
});