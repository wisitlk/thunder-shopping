import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, UserCog, Shield, User as UserIcon } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, UserProfile, UserRole } from '@/lib/supabase';
import Toast from 'react-native-toast-message';

interface UserWithRoles extends UserProfile {
  roles: UserRole[];
}

export default function ManageUsersScreen() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/(tabs)');
      return;
    }

    loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoading(true);

    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error loading profiles:', profilesError);
      setLoading(false);
      return;
    }

    const usersWithRoles: UserWithRoles[] = [];

    for (const profile of profiles || []) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', profile.id);

      usersWithRoles.push({
        ...profile,
        roles: roles || [],
      });
    }

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const handleToggleAdmin = async (user: UserWithRoles) => {
    const isCurrentlyAdmin = user.roles.some(r => r.role === 'admin');

    Alert.alert(
      isCurrentlyAdmin ? 'Remove Admin Role' : 'Grant Admin Role',
      `Are you sure you want to ${isCurrentlyAdmin ? 'remove admin access from' : 'grant admin access to'} ${user.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isCurrentlyAdmin ? 'Remove' : 'Grant',
          style: isCurrentlyAdmin ? 'destructive' : 'default',
          onPress: async () => {
            if (isCurrentlyAdmin) {
              const adminRole = user.roles.find(r => r.role === 'admin');
              if (adminRole) {
                const { error } = await supabase
                  .from('user_roles')
                  .delete()
                  .eq('id', adminRole.id);

                if (error) {
                  console.error('Error removing admin role:', error);
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to remove admin role',
                    position: 'top',
                    visibilityTime: 3000,
                    topOffset: 60,
                  });
                  return;
                }

                Toast.show({
                  type: 'success',
                  text1: 'Admin Role Removed',
                  text2: `${user.email} is no longer an admin`,
                  position: 'top',
                  visibilityTime: 3000,
                  topOffset: 60,
                });
              }
            } else {
              const { error } = await supabase
                .from('user_roles')
                .insert({ user_id: user.id, role: 'admin' });

              if (error) {
                console.error('Error granting admin role:', error);
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Failed to grant admin role',
                  position: 'top',
                  visibilityTime: 3000,
                  topOffset: 60,
                });
                return;
              }

              Toast.show({
                type: 'success',
                text1: 'Admin Role Granted',
                text2: `${user.email} is now an admin`,
                position: 'top',
                visibilityTime: 3000,
                topOffset: 60,
              });
            }

            await loadUsers();
          }
        }
      ]
    );
  };

  const renderUserItem = ({ item }: { item: UserWithRoles }) => {
    const isUserAdmin = item.roles.some(r => r.role === 'admin');

    return (
      <View style={styles.userCard}>
        <View style={styles.userIconContainer}>
          {isUserAdmin ? (
            <Shield size={24} color="#E91E63" />
          ) : (
            <UserIcon size={24} color="#666" />
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.rolesContainer}>
            {item.roles.map((role) => (
              <View
                key={role.id}
                style={[
                  styles.roleBadge,
                  role.role === 'admin' && styles.adminBadge
                ]}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    role.role === 'admin' && styles.adminBadgeText
                  ]}
                >
                  {role.role}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            isUserAdmin && styles.toggleButtonActive
          ]}
          onPress={() => handleToggleAdmin(item)}
        >
          <UserCog size={20} color={isUserAdmin ? '#E91E63' : '#666'} />
        </TouchableOpacity>
      </View>
    );
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Users</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Manage user roles and permissions. Grant or remove admin access to users.
          </Text>
        </View>

        <Text style={styles.userCount}>{users.length} user{users.length !== 1 ? 's' : ''}</Text>

        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={loadUsers}
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
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  userCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  listContainer: {
    gap: 12,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  rolesContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  adminBadge: {
    backgroundColor: '#FFF0F5',
  },
  roleBadgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  adminBadgeText: {
    color: '#E91E63',
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  toggleButtonActive: {
    backgroundColor: '#FFF0F5',
  },
});
