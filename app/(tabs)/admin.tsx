import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Users, UserCog, BarChart3, Package, Settings } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalOrders: number;
  totalProducts: number;
}

export default function AdminDashboardScreen() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/(tabs)');
      return;
    }

    loadDashboardStats();
  }, [isAdmin]);

  const loadDashboardStats = async () => {
    setLoading(true);

    const { count: usersCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    const { data: adminRoles } = await supabase
      .from('user_roles')
      .select('*')
      .eq('role', 'admin');

    setStats({
      totalUsers: usersCount || 0,
      totalAdmins: adminRoles?.length || 0,
      totalOrders: 0,
      totalProducts: 0,
    });

    setLoading(false);
  };

  if (!isAdmin) {
    return null;
  }

  const handleManageUsers = () => {
    router.push('/admin/manage-users');
  };

  const handleManageProducts = () => {
    router.push('/admin/add-product');
  };

  const handleManageLocations = () => {
    router.push('/admin/manage-locations');
  };

  const handleOrderTracking = () => {
    router.push('/admin/order-tracking');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.email}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Users size={24} color="#E91E63" />
                </View>
                <Text style={styles.statValue}>{stats.totalUsers}</Text>
                <Text style={styles.statLabel}>Total Users</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <UserCog size={24} color="#E91E63" />
                </View>
                <Text style={styles.statValue}>{stats.totalAdmins}</Text>
                <Text style={styles.statLabel}>Admins</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Package size={24} color="#E91E63" />
                </View>
                <Text style={styles.statValue}>{stats.totalOrders}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <BarChart3 size={24} color="#E91E63" />
                </View>
                <Text style={styles.statValue}>{stats.totalProducts}</Text>
                <Text style={styles.statLabel}>Products</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <TouchableOpacity style={styles.actionCard} onPress={handleManageUsers}>
              <View style={styles.actionIconContainer}>
                <Users size={24} color="#E91E63" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Manage Users</Text>
                <Text style={styles.actionDescription}>View and manage user accounts and roles</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleManageProducts}>
              <View style={styles.actionIconContainer}>
                <Package size={24} color="#E91E63" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Manage Products</Text>
                <Text style={styles.actionDescription}>Add and update product listings</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleManageLocations}>
              <View style={styles.actionIconContainer}>
                <Settings size={24} color="#E91E63" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Manage Locations</Text>
                <Text style={styles.actionDescription}>Add and manage shipping locations</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleOrderTracking}>
              <View style={styles.actionIconContainer}>
                <BarChart3 size={24} color="#E91E63" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Order Tracking</Text>
                <Text style={styles.actionDescription}>Track and update order statuses</Text>
              </View>
            </TouchableOpacity>
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
  },
});
