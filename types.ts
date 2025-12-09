export interface Destination {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  location: string;
  duration: string; // e.g., "5 Days / 4 Nights"
  rating: number;
  features: string[];
  itinerary?: DayPlan[];
}

export interface DayPlan {
  day: number;
  title: string;
  activities: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Booking {
  id: string;
  destinationId: string;
  destinationName: string;
  userId: string;
  userName: string;
  date: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export enum ViewState {
  HOME = 'HOME',
  DESTINATION_DETAILS = 'DESTINATION_DETAILS',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  ADMIN_PANEL = 'ADMIN_PANEL',
}
