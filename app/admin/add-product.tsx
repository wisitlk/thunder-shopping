import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Package, DollarSign, FileText, Image as ImageIcon, Hash, MapPin } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAdmin } from '@/contexts/AdminContext';

export default function AddProductScreen() {
  const { locations, addProduct } = useAdmin();@react
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    stockQuantity: '',
    location: locations.length > 0 ? locations[0].name : '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = 'Stock quantity is required';
    } else if (isNaN(Number(formData.stockQuantity)) || Number(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Please enter a valid stock quantity';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSaveProduct = () => {
    if (!validateForm()) {
      return;
    }

    const productData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      stockQuantity: Number(formData.stockQuantity),
      location: formData.location,
    };

    // Add product to context
    addProduct(productData);

    // Log to console
    console.log('Product saved:', productData);

    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Product Saved!',
      text2: `${productData.name} has been added successfully.`,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 60,
    });

    // Navigate back to profile
    router.back();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Package size={20} color="#E91E63" />
              <Text style={styles.sectionTitle}>Product Information</Text>
            </View>

            <Input
              label="Product Name"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              placeholder="Enter product name"
              error={errors.name}
            />

            <Input
              label="Price ($)"
              value={formData.price}
              onChangeText={(text) => updateFormData('price', text)}
              placeholder="0.00"
              keyboardType="numeric"
              error={errors.price}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <Input
                label=""
                value={formData.description}
                onChangeText={(text) => updateFormData('description', text)}
                placeholder="Enter detailed product description"
                multiline
                numberOfLines={4}
                style={styles.textArea}
                error={errors.description}
              />
            </View>

            <Input
              label="Image URL"
              value={formData.imageUrl}
              onChangeText={(text) => updateFormData('imageUrl', text)}
              placeholder="https://example.com/image.jpg"
              autoCapitalize="none"
              error={errors.imageUrl}
            />

            <Input
              label="Initial Stock Quantity"
              value={formData.stockQuantity}
              onChangeText={(text) => updateFormData('stockQuantity', text)}
              placeholder="0"
              keyboardType="numeric"
              error={errors.stockQuantity}
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#E91E63" />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Seller Location</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.location}
                  onValueChange={(value) => updateFormData('location', value)}
                  style={styles.picker}
                >
                  {locations.map((location) => (
                    <Picker.Item
                      key={location.id}
                      label={location.name}
                      value={location.name}
                    />
                  ))}
                </Picker>
              </View>
              {errors.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}
            </View>
          </View>

          {locations.length === 0 && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                No locations available. Please add locations first in the Manage Locations section.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          title="Save Product"
          onPress={handleSaveProduct}
          style={styles.saveButton}
          disabled={locations.length === 0}
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
  formSection: {
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
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
  errorText: {
    color: '#E91E63',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEAA7',
    marginBottom: 16,
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    paddingVertical: 18,
  },
});