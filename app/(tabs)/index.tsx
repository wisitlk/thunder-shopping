import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ProductCard } from '@/components/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const renderProduct = ({ item }: { item: typeof mockProducts[0] }) => (
    <ProductCard product={item} onPress={() => handleProductPress(item.id)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.deliverTo}>Deliver to:</Text>
        <Text style={styles.address}>{user?.address}</Text>
      </View>

      <FlatList
        data={mockProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  deliverTo: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  address: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  listContainer: {
    paddingVertical: 8,
  },
});