import { Destination } from './types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Santorini Sunset Retreat',
    location: 'Greece',
    description: 'Experience the magic of the Aegean Sea with white-washed buildings and breathtaking sunsets. A perfect blend of relaxation and exploration.',
    price: 1800,
    image: 'https://picsum.photos/800/600?random=1',
    duration: '5 Days',
    rating: 4.8,
    features: ['Luxury Villa', 'Private Boat Tour', 'Wine Tasting'],
    itinerary: [
        { day: 1, title: 'Arrival & Welcome', activities: ['Transfer to hotel', 'Welcome dinner with sunset view'] },
        { day: 2, title: 'Island Exploration', activities: ['Visit Oia', 'Shopping in Fira'] },
        { day: 3, title: 'Volcanic Adventure', activities: ['Boat tour to the volcano', 'Hot springs swim'] }
    ]
  },
  {
    id: '2',
    name: 'Kyoto Cultural Immersion',
    location: 'Japan',
    description: 'Step back in time in the ancient capital of Japan. Visit stunning temples, walk through bamboo forests, and participate in a traditional tea ceremony.',
    price: 2200,
    image: 'https://picsum.photos/800/600?random=2',
    duration: '7 Days',
    rating: 4.9,
    features: ['Temple Tours', 'Tea Ceremony', 'Bullet Train Pass'],
    itinerary: [
        { day: 1, title: 'Arrival in Kyoto', activities: ['Check-in', 'Gion District walking tour'] },
        { day: 2, title: 'Northern Kyoto', activities: ['Kinkaku-ji (Golden Pavilion)', 'Ryoan-ji Zen Garden'] }
    ]
  },
  {
    id: '3',
    name: 'Bali Tropical Paradise',
    location: 'Indonesia',
    description: 'Immerse yourself in the lush jungles and pristine beaches of Bali. From spiritual temples to vibrant nightlife, this island has it all.',
    price: 1200,
    image: 'https://picsum.photos/800/600?random=3',
    duration: '6 Days',
    rating: 4.7,
    features: ['Beachfront Resort', 'Surfing Lessons', 'Ubud Monkey Forest'],
    itinerary: [
        { day: 1, title: 'Ubud Welcome', activities: ['Transfer to Ubud', 'Relax at resort'] },
        { day: 2, title: 'Culture & Nature', activities: ['Monkey Forest', 'Tegalalang Rice Terrace'] }
    ]
  },
  {
    id: '4',
    name: 'Machu Picchu Expedition',
    location: 'Peru',
    description: 'Journey to the Lost City of the Incas. A bucket-list adventure featuring hiking, history, and stunning Andean landscapes.',
    price: 2500,
    image: 'https://picsum.photos/800/600?random=4',
    duration: '6 Days',
    rating: 4.9,
    features: ['Guided Trek', 'Train to Aguas Calientes', 'Historic Sites'],
    itinerary: [
        { day: 1, title: 'Cusco Acclimatization', activities: ['Arrival in Cusco', 'Light city walk'] },
        { day: 2, title: 'Sacred Valley', activities: ['Pisac Market', 'Ollantaytambo Fortress'] }
    ]
  },
];
