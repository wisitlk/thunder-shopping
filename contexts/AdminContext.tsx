import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Location {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  stockQuantity: number;
  location: string;
}

export interface TrackingUpdate {
  id: string;
  status: string;
  timestamp: string;
}

export interface Order {
  id: string;
  customerName: string;
  shippingAddress: string;
  productOrdered: string;
  trackingHistory: TrackingUpdate[];
}

interface AdminContextType {
  locations: Location[];
  products: Product[];
  orders: Order[];
  addLocation: (name: string) => void;
  removeLocation: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  findOrder: (orderId: string) => Order | null;
  updateOrderStatus: (orderId: string, status: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([
    { id: '1', name: 'Chicago Main' },
    { id: '2', name: 'LA Distribution' },
    { id: '3', name: 'New York Warehouse' },
  ]);

  const [products, setProducts] = useState<Product[]>([]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'John Smith',
      shippingAddress: '123 Main St, San Francisco, CA 94102',
      productOrdered: 'Wireless Bluetooth Headphones',
      trackingHistory: [
        { id: '1', status: 'Order Placed', timestamp: '2024-01-15 10:30 AM' },
        { id: '2', status: 'Processing', timestamp: '2024-01-15 2:15 PM' },
        { id: '3', status: 'Shipped', timestamp: '2024-01-16 9:00 AM' },
      ]
    },
    {
      id: 'ORD-002',
      customerName: 'Sarah Johnson',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
      productOrdered: 'Smart Watch Series 7',
      trackingHistory: [
        { id: '1', status: 'Order Placed', timestamp: '2024-01-14 3:45 PM' },
        { id: '2', status: 'Processing', timestamp: '2024-01-15 8:30 AM' },
      ]
    }
  ]);

  const addLocation = (name: string) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: name.trim(),
    };
    setLocations(prev => [...prev, newLocation]);
  };

  const removeLocation = (id: string) => {
    setLocations(prev => prev.filter(location => location.id !== id));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const findOrder = (orderId: string): Order | null => {
    return orders.find(order => order.id === orderId) || null;
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    const now = new Date();
    const timestamp = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newUpdate: TrackingUpdate = {
      id: Date.now().toString(),
      status,
      timestamp,
    };

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          trackingHistory: [newUpdate, ...order.trackingHistory]
        };
      }
      return order;
    }));
  };

  return (
    <AdminContext.Provider value={{
      locations,
      products,
      orders,
      addLocation,
      removeLocation,
      addProduct,
      findOrder,
      updateOrderStatus
    }}>
      {children}
    </AdminContext.Provider>
  );
};