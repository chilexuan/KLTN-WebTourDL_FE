export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface Tour {
  id: number;
  title: string;
  location: string;
  image: string;
  price: number;
  discount?: number;
  duration: string;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  description: string;
  itinerary: ItineraryItem[];
}

export interface FilterParams {
  destination?: string;
  duration: string;
  priceRange: string;
}