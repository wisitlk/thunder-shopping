import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CircleCheck as CheckCircle, Package, Chrome as Home } from 'lucide-react-native';
import { Button } from '@/components/Button';

export default function OrderConfirmationScreen() {
  const mockOrderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  const handleContinueShopping = () => {
    router.replace('/(tabs)');
  };

  const handleViewOrders = () => {
    router.replace('/(tabs)/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color="#28A745" />
        </View>

        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>Thank you for your order</Text>

        <View style={styles.orderInfoContainer}>
          <Text style={styles.orderLabel}>Order Number:</Text>
          <Text style={styles.orderNumber}>{mockOrderNumber}</Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Your order has been successfully placed and is being processed. 
            You will receive a confirmation email shortly with tracking information.
          </Text>
        </View>

        <View style={styles.estimatedDelivery}>
          <Package size={20} color="#E91E63" />
          <Text style={styles.deliveryText}>
            Estimated delivery: 3-5 business days
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Continue Shopping"
            onPress={handleContinueShopping}
            style={styles.primaryButton}
          />
          
          <Button
            title="View My Orders"
            onPress={handleViewOrders}
            variant="secondary"
            style={styles.secondaryButton}
          />
        </View>

        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>
            Need help? Contact our customer support team
          </Text>
          <Text style={styles.supportEmail}>support@example.com</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  orderInfoContainer: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E91E63',
  },
  messageContainer: {
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  estimatedDelivery: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 40,
  },
  deliveryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  primaryButton: {
    paddingVertical: 16,
  },
  secondaryButton: {
    paddingVertical: 16,
  },
  supportContainer: {
    alignItems: 'center',
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  supportEmail: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
  },
});