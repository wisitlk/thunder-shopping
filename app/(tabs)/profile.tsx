import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, MapPin, User as UserIcon, Package } from 'lucide-react-native';

interface OrderHistoryItem {
  id: string;
  date: string;
  total: number;
  status: string;
}

const mockOrderHistory: OrderHistoryItem[] = [
  { id: 'ORD-001', date: '2024-01-15', total: 299.99, status: 'Delivered' },
  { id: 'ORD-002', date: '2024-01-10', total: 89.99, status: 'Shipped' },
  { id: 'ORD-003', date: '2024-01-05', total: 179.99, status: 'Processing' },
  { id: 'ORD-004', date: '2023-12-28', total: 450.00, status: 'Delivered' },
];

export default function ProfileScreen() {
  const { user, logout, updateAddress } = useAuth();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: 'John Doe',
    streetAddress: '123 Main St',
    city: 'San Francisco',
    zipCode: '94102',
    country: 'United States'
  });

  const handleSaveAddress = () => {
    const fullAddress = `${addressForm.streetAddress}, ${addressForm.city}, ${addressForm.zipCode}`;
    updateAddress(fullAddress);
    setIsEditingAddress(false);
    Alert.alert('Success', 'Shipping address updated successfully!');
    console.log('Address saved:', addressForm);
  };

  const handleOrderPress = (orderId: string) => {
    console.log('Order pressed:', orderId);
    // Future: Navigate to order details
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#28A745';
      case 'Shipped': return '#007BFF';
      case 'Processing': return '#FFC107';
      default: return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>My Profile</Text>

          {/* User Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <UserIcon size={20} color="#E91E63" />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Mail size={16} color="#666" />
                <Text style={styles.infoText}>{user?.email}</Text>
              </View>
            </View>
          </View>

          {/* Shipping Address Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#E91E63" />
              <Text style={styles.sectionTitle}>Shipping Address</Text>
            </View>
            
            {isEditingAddress ? (
              <View style={styles.editingContainer}>
                <Input
                  label="Full Name"
                  value={addressForm.fullName}
                  onChangeText={(text) => setAddressForm({...addressForm, fullName: text})}
                  placeholder="Enter your full name"
                />
                <Input
                  label="Street Address"
                  value={addressForm.streetAddress}
                  onChangeText={(text) => setAddressForm({...addressForm, streetAddress: text})}
                  placeholder="Enter your street address"
                />
                <View style={styles.rowInputs}>
                  <Input
                    label="City"
                    value={addressForm.city}
                    onChangeText={(text) => setAddressForm({...addressForm, city: text})}
                    placeholder="City"
                    style={styles.halfInput}
                  />
                  <Input
                    label="ZIP Code"
                    value={addressForm.zipCode}
                    onChangeText={(text) => setAddressForm({...addressForm, zipCode: text})}
                    placeholder="ZIP"
                    style={styles.halfInput}
                  />
                </View>
                <Input
                  label="Country"
                  value={addressForm.country}
                  onChangeText={(text) => setAddressForm({...addressForm, country: text})}
                  placeholder="Enter your country"
                />
                <View style={styles.buttonRow}>
                  <Button
                    title="Cancel"
                    onPress={() => setIsEditingAddress(false)}
                    variant="secondary"
                    style={styles.halfButton}
                  />
                  <Button
                    title="Save Address"
                    onPress={handleSaveAddress}
                    style={styles.halfButton}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.addressContainer}>
                <View style={styles.infoCard}>
                  <Text style={styles.addressName}>{addressForm.fullName}</Text>
                  <Text style={styles.infoText}>
                    {addressForm.streetAddress}
                  </Text>
                  <Text style={styles.infoText}>
                    {addressForm.city}, {addressForm.zipCode}
                  </Text>
                  <Text style={styles.infoText}>{addressForm.country}</Text>
                </View>
                <Button
                  title="Edit Address"
                  onPress={() => setIsEditingAddress(true)}
                  variant="secondary"
                  style={styles.editButton}
                />
              </View>
            )}
          </View>

          {/* Order History Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Package size={20} color="#E91E63" />
              <Text style={styles.sectionTitle}>My Order History</Text>
            </View>
            <View style={styles.orderHistoryContainer}>
              {mockOrderHistory.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  style={styles.orderItem}
                  onPress={() => handleOrderPress(order.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>Order {order.id}</Text>
                    <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
                      {order.status}
                    </Text>
                  </View>
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderDate}>{order.date}</Text>
                    <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Logout Section */}
          <View style={styles.logoutSection}>
            <Button
              title="Logout"
              onPress={handleLogout}
              style={styles.logoutButton}
              textStyle={styles.logoutButtonText}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  editingContainer: {
    gap: 16,
  },
  addressContainer: {
    gap: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  orderHistoryContainer: {
    gap: 12,
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E91E63',
  },
  logoutSection: {
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  logoutButton: {
    backgroundColor: '#DC3545',
  },
  logoutButtonText: {
    color: '#FFFFFF',
  },
});