export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  location: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 89.99,
    imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    name: 'Smart Watch Series 7',
    price: 299.99,
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
    location: 'New York, NY'
  },
  {
    id: '3',
    name: 'Professional Camera Lens',
    price: 450.00,
    imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=500',
    location: 'Los Angeles, CA'
  },
  {
    id: '4',
    name: 'Portable Wireless Speaker',
    price: 125.50,
    imageUrl: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500',
    location: 'Chicago, IL'
  },
  {
    id: '5',
    name: 'Gaming Mechanical Keyboard',
    price: 179.99,
    imageUrl: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=500',
    location: 'Austin, TX'
  },
  {
    id: '6',
    name: 'Smartphone with 5G',
    price: 699.99,
    imageUrl: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=500',
    location: 'Seattle, WA'
  },
  {
    id: '7',
    name: 'Laptop Stand Adjustable',
    price: 49.99,
    imageUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500',
    location: 'Denver, CO'
  },
  {
    id: '8',
    name: 'Wireless Charging Pad',
    price: 39.99,
    imageUrl: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=500',
    location: 'Miami, FL'
  }
];