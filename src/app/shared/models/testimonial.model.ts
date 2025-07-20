export interface Testimonial {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  updated_at: string;
  author: {
    username: string;
  };
  tour?: {
    id: number;
    title: string;
  };
  location?: {
    id: number;
    name: string;
  };
}