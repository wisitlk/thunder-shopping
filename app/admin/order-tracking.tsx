import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Search, Package, MapPin, Clock, CheckCircle } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAdmin, Order, TrackingUpdate } from '@/contexts/AdminContext';

const statusOptions = [
  { label: 'Select Status', value: '' },
  { label: 'In Transit', value: 'In Transit' },
  { label: 'Out for Delivery', value: 'Out for Delivery' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Delayed', value: 'Delayed' },
];

export default function OrderTrackingScreen() {
  const { findOrder, updateOrderStatus } = useAdmin();
  const [orderId, setOrderId] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleFindOrder = () => {
    if (!orderId.trim()) {
      setSearchError('Please enter an order ID');
      return;
    }

    const order = findOrder(orderId.trim());
    if (order) {
      setCurrentOrder(order);
      setSearchError('');
      Toast.show({
        type: 'success',
        text1: 'Order Found!',
        text2: `Order ${order.id} loaded successfully.`,
        position: 'top',
        visibilityTime: 2000,
        topOffset: 60,
      });
    } else {
      setCurrentOrder(null);
      setSearchError('Order not found. Please check the order ID.');
    }
  };

  const handleUpdateStatus = () => {
    if (!currentOrder) {
      return;
    }

    if (!selectedStatus) {
      Toast.show({
        type: 'error',
        text1: 'No Status Selected',
        text2: 'Please select a status to update.',
        position: 'top',
        visibilityTime: 2000,
        topOffset: 60,
      });
      return;
    }

    updateOrderStatus(currentOrder.id, selectedStatus);
    
    // Refresh the current order to show the new status
    const updatedOrder = findOrder(currentOrder.id);
    setCurrentOrder(updatedOrder);
    setSelectedStatus('');

    Toast.show({
      type: 'success',
      text1: 'Status Updated!',
      text2: `Order ${currentOrder.id} status updated to "${selectedStatus}".`,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 60,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle size={16} color="#28A745" />;
      case 'shipped':
      case 'in transit':
      case 'out for delivery':
        return <Package size={16} color="#007BFF" />;
      default:
        return <Clock size={16} color="#FFC107" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#28A745';
      case 'shipped':
      case 'in transit':
      case 'out for delivery':
        return '#007BFF';
      case 'delayed':
        return '#DC3545';
      default:
        return '#FFC107';
    }
  };

  const renderTrackingItem = ({ item }: { item: TrackingUpdate }) => (
    <View style={styles.trackingItem}>
      <View style={styles.trackingIcon}>
        {getStatusIcon(item.status)}
      </View>
      <View style={styles.trackingContent}>
        <Text style={[styles.trackingStatus, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
        <Text style={styles.trackingTimestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Order Lookup Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Search size={20} color="#E91E63" />
              <Text style={styles.sectionTitle}>Order Lookup</Text>
            </View>
            
            <View style={styles.lookupContainer}>
              <Input
                label="Order ID"
                value={orderId}
                onChangeText={(text) => {
                  setOrderId(text);
                  if (searchError) setSearchError('');
                }}
                placeholder="e.g., ORD-001"
                error={searchError}
              />
              <Button
                title="Find Order"
                onPress={handleFindOrder}
                style={styles.findButton}
              />
            </View>
          </View>

          {/* Order Details Section */}
          {currentOrder && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Package size={20} color="#E91E63" />
                <Text style={styles.sectionTitle}>Order Details</Text>
              </View>
              
              <View style={styles.orderDetailsContainer}>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Order ID:</Text>
                  <Text style={styles.orderDetailValue}>{currentOrder.id}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Customer:</Text>
                  <Text style={styles.orderDetailValue}>{currentOrder.customerName}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Product:</Text>
                  <Text style={styles.orderDetailValue}>{currentOrder.productOrdered}</Text>
                </View>
                <View style={styles.addressRow}>
                  <Text style={styles.orderDetailLabel}>Shipping Address:</Text>
                  <Text style={styles.addressValue}>{currentOrder.shippingAddress}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Tracking History Section */}
          {currentOrder && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color="#E91E63" />
                <Text style={styles.sectionTitle}>Tracking History</Text>
              </View>
              
              <View style={styles.trackingContainer}>
                <FlatList
                  data={currentOrder.trackingHistory}
                  renderItem={renderTrackingItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.trackingList}
                />
              </View>
            </View>
          )}

          {/* Status Update Section */}
          {currentOrder && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Package size={20} color="#E91E63" />
                <Text style={styles.sectionTitle}>Update Status</Text>
              </View>
              
              <View style={styles.updateContainer}>
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>New Status</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={selectedStatus}
                      onValueChange={setSelectedStatus}
                      style={styles.picker}
                    >
                      {statusOptions.map((option) => (
                        <Picker.Item
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                
                <Button
                  title="Update Status"
                  onPress={handleUpdateStatus}
                  style={styles.updateButton}
                  disabled={!selectedStatus}
                />
              </View>
            </View>
          )}

          {/* Empty State */}
          {!currentOrder && !searchError && orderId === '' && (
            <View style={styles.emptyContainer}>
              <Search size={48} color="#CCC" />
              <Text style={styles.emptyTitle}>Search for an Order</Text>
              <Text style={styles.emptySubtitle}>
                Enter an order ID above to view tracking details
              </Text>
            </View>
          )}
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
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  lookupContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 16,
  },
  findButton: {
    marginTop: 8,
  },
  orderDetailsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 12,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressRow: {
    gap: 8,
  },
  orderDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  orderDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  addressValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    lineHeight: 20,
  },
  trackingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  trackingList: {
    padding: 16,
  },
  trackingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  trackingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingContent: {
    flex: 1,
  },
  trackingStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackingTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  updateContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 16,
  },
  pickerContainer: {
    gap: 8,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  picker: {
    height: 56,
    color: '#333',
  },
  updateButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});