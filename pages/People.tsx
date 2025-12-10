import React, { useEffect, useState } from 'react';
import { fetchPotentialMatches } from '../services/supabaseService';
import { User } from '../types';
import { MapPin, Filter } from 'lucide-react';

const People: React.FC = () => {
  const [people, setPeople] = useState<User[]>([]);

  useEffect(() => {
    fetchPotentialMatches().then(setPeople);
  }, []);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="px-4 py-4 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Nearby People</h1>
        <button className="p-2 bg-gray-100 rounded-full">
           <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {people.map((person) => (
            <div key={person.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
              <div className="h-32 bg-gray-200 relative">
                 <img src={person.photos[0]} className="w-full h-full object-cover" alt={person.name} />
                 <div className="absolute top-2 right-2 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                 <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{person.name}, {person.age}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {person.location.split(',')[0]}
                    </div>
                 </div>
                 <button className="w-full mt-3 py-1.5 bg-pink-50 text-pink-600 text-xs font-bold rounded-lg hover:bg-pink-100 transition">
                   Say Hi
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default People;