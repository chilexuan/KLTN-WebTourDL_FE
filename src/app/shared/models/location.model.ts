export interface Location {
  id: number;
  name: string;
  description: string;
  rating: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  category: {
    name: string;
  };
  tour_count: number;
}