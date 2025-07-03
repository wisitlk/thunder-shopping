import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, Plus, Trash2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAdmin, Location } from '@/contexts/AdminContext';

export default function ManageLocationsScreen() {
  const { locations, addLocation, removeLocation } = useAdmin();
  const [newLocationName, setNewLocationName] = useState('');
  const [error, setError] = useState('');

  const handleAddLocation = () => {
    if (!newLocationName.trim()) {
      setError('Location name is required');
      return;
    }

    // Check for duplicate names
    const isDuplicate = locations.some(
      location => location.name.toLowerCase() === newLocationName.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError('A location with this name already exists');
      return;
    }

    addLocation(newLocationName);
    setNewLocationName('');
    setError('');

    Toast.show({
      type: 'success',
      text1: 'Location Added!',
      text2: `${newLocationName.trim()} has been added successfully.`,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 60,
    });
  };

  const handleRemoveLocation = (location: Location) => {
    Alert.alert(
      'Remove Location',
      `Are you sure you want to remove "${location.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeLocation(location.id);
            Toast.show({
              type: 'success',
              text1: 'Location Removed',
              text2: `${location.name} has been removed.`,
              position: 'top',
              visibilityTime: 2000,
              topOffset: 60,
            });
          }
        }
      ]
    );
  };

  const renderLocationItem = ({ item }: { item: Location }) => (
    <View style={styles.locationItem}>
      <View style={styles.locationInfo}>
        <MapPin size={20} color="#E91E63" />
        <Text style={styles.locationName}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveLocation(item)}
      >
        <Trash2 size={18} color="#DC3545" />
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Manage Locations</Text>
      </View>

      <View style={styles.content}>
        {/* Add New Location Section */}
        <View style={styles.addSection}>
          <View style={styles.sectionHeader}>
            <Plus size={20} color="#E91E63" />
            <Text style={styles.sectionTitle}>Add New Location</Text>
          </View>
          
          <View style={styles.addLocationContainer}>
            <Input
              label="Location Name"
              value={newLocationName}
              onChangeText={(text) => {
                setNewLocationName(text);
                if (error) setError('');
              }}
              placeholder="e.g., New York Warehouse"
              error={error}
            />
            <Button
              title="Add Location"
              onPress={handleAddLocation}
              style={styles.addButton}
            />
          </View>
        </View>

        {/* Locations List Section */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#E91E63" />
            <Text style={styles.sectionTitle}>
              Current Locations ({locations.length})
            </Text>
          </View>

          {locations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MapPin size={48} color="#CCC" />
              <Text style={styles.emptyTitle}>No locations yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first location to get started
              </Text>
            </View>
          ) : (
            <FlatList
              data={locations}
              renderItem={renderLocationItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  addSection: {
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
  addLocationContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 16,
  },
  addButton: {
    marginTop: 8,
  },
  listSection: {
    flex: 1,
  },
  listContainer: {
    gap: 12,
  },
  locationItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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