import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, MapPin, Star } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from '@/components/Button';
import { mockProducts } from '@/data/mockProducts';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    
    // Show success toast notification
    Toast.show({
      type: 'success',
      text1: 'Added to Cart!',
      text2: `${product.name} has been added to your cart.`,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 60,
    });
  };

  const productDescription = `Experience premium quality with the ${product.name}. This carefully crafted product combines innovative design with exceptional functionality, making it perfect for your daily needs.

Key Features:
• Premium materials and construction
• Modern, sleek design
• Excellent performance and reliability
• Perfect for both personal and professional use
• Backed by manufacturer warranty

Whether you're looking to upgrade your current setup or trying something new, this product delivers outstanding value and performance that exceeds expectations.`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.rating}>4.8 (124 reviews)</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <MapPin size={16} color="#666" />
            <Text style={styles.location}>Ships from: {product.location}</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Product Description</Text>
            <Text style={styles.description}>{productDescription}</Text>
          </View>

          <View style={styles.shippingInfo}>
            <Text style={styles.shippingTitle}>Shipping Information</Text>
            <Text style={styles.shippingText}>• Free shipping on orders over $50</Text>
            <Text style={styles.shippingText}>• Standard delivery: 3-5 business days</Text>
            <Text style={styles.shippingText}>• Express delivery available</Text>
            <Text style={styles.shippingText}>• 30-day return policy</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    lineHeight: 32,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E91E63',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  shippingInfo: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  shippingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  shippingText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  addToCartButton: {
    paddingVertical: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});