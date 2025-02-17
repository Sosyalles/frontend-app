export interface Event {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  image?: string;
  attendees: number;
  featured?: boolean;
} 