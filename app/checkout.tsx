import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { Button } from '@/components/Button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CheckoutScreen() {
  const { items, getTotalPrice, getSubtotal, getShippingCost, clearCart } = useCart();
  const { user } = useAuth();

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty.');
      return;
    }

    // Clear cart and navigate to confirmation
    clearCart();
    router.replace('/order-confirmation');
  };

  const mockPaymentMethod = "Visa ending in 1234";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Shipping Address Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#E91E63" />
              <Text style={styles.sectionTitle}>Shipping Address</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.addressName}>John Doe</Text>
              <Text style={styles.addressText}>{user?.address}</Text>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Method Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CreditCard size={20} color="#E91E63" />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.paymentText}>{mockPaymentMethod}</Text>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Order Summary Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Package size={20} color="#E91E63" />
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>
            <View style={styles.card}>
              {items.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.orderItemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.orderItemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.orderItemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
              
              <View style={styles.divider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>${getSubtotal().toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping:</Text>
                <Text style={styles.summaryValue}>${getShippingCost().toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${getTotalPrice().toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By placing this order, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.finalTotalContainer}>
          <Text style={styles.finalTotalLabel}>Total: </Text>
          <Text style={styles.finalTotalValue}>${getTotalPrice().toFixed(2)}</Text>
        </View>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          style={styles.placeOrderButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  changeButton: {
    alignSelf: 'flex-start',
  },
  changeButtonText: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  orderItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E91E63',
  },
  termsContainer: {
    marginTop: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  finalTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  finalTotalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E91E63',
  },
  placeOrderButton: {
    paddingVertical: 18,
  },
});