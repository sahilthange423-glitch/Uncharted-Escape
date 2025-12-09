import React from 'react';
import { Destination } from '../types';
import { MapPin, Clock, Star } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  onClick: (id: string) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick }) => {
  return (
    <div 
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100"
      onClick={() => onClick(destination.id)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <Star className="text-yellow-400 fill-yellow-400" size={14} />
            <span className="text-xs font-bold text-slate-800">{destination.rating}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex justify-between items-start">
             <div>
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{destination.name}</h3>
                <div className="flex items-center mt-1 text-slate-500 text-sm">
                    <MapPin size={14} className="mr-1" />
                    <span>{destination.location}</span>
                </div>
             </div>
        </div>
        
        <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
             <div className="flex items-center text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded">
                <Clock size={12} className="mr-1"/>
                {destination.duration}
             </div>
             <div className="text-right">
                <span className="text-xs text-slate-400 block">Starting from</span>
                <span className="text-lg font-bold text-brand-600">${destination.price.toLocaleString()}</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
