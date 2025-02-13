export interface Event {
  id: number;
  title: string;
  location: string;
  date: string;
  category: string;
  attendees: number;
  featured?: boolean;
  image?: string;
  bannerImage?: string;
  description?: string;
  price?: number;
  startTime?: string;
  endTime?: string;
  organizer?: {
    name: string;
    avatar: string;
    role: string;
  };
  schedule?: {
    day: string;
    events: {
      time: string;
      title: string;
      speaker?: string;
      type: string;
    }[];
  }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface EventsResponse {
  events: Event[];
}

export interface CategoriesResponse {
  categories: Category[];
} 