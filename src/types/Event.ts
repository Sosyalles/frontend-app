export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  attendees: number;
  bannerImage?: string;
  startTime: string;
  endTime: string;
  organizer: {
    name: string;
    avatar: string;
    role: string;
  };
} 