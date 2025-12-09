import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { suggestDestinations } from '../services/geminiService';

interface HeroProps {
  onSearch: (query: string) => void;
  onSuggestionClick: (suggestion: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch, onSuggestionClick }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAiSuggest = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
        const results = await suggestDestinations(query);
        setSuggestions(results);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="relative bg-slate-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Scenic mountain landscape"
        />
        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
      </div>

      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Find your next <span className="text-brand-500">Uncharted</span> adventure.
        </h1>
        <p className="mt-6 text-xl text-slate-300 max-w-3xl">
          Discover places you've never dreamed of. Use our AI-powered travel assistant to find the perfect getaway tailored just for you.
        </p>

        <div className="mt-10 max-w-xl">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tell AI what you want (e.g., 'Tropical honeymoon under $3k')"
                    className="block w-full rounded-l-lg border-0 py-4 px-5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-500 text-lg shadow-lg"
                    onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
                />
                <button
                    onClick={handleAiSuggest}
                    disabled={loading}
                    className="h-full rounded-r-lg bg-brand-600 px-6 py-4 text-white hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-70 flex items-center gap-2 shadow-lg"
                >
                   {loading ? (
                       <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                   ) : (
                       <>
                         <Sparkles size={20} />
                         <span>Plan</span>
                       </>
                   )}
                </button>
            </div>
            
            {/* Suggestions pill container */}
            {suggestions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-slate-300 mr-2 self-center">AI Suggestions:</span>
                    {suggestions.map((place, idx) => (
                        <button 
                            key={idx}
                            onClick={() => onSuggestionClick(place)}
                            className="inline-flex items-center rounded-full bg-brand-500/20 px-3 py-1 text-sm font-medium text-brand-200 ring-1 ring-inset ring-brand-500/50 hover:bg-brand-500/30 transition-colors backdrop-blur-sm"
                        >
                            {place} <ArrowRight size={14} className="ml-1"/>
                        </button>
                    ))}
                </div>
            )}
            
            {/* Default prompt if no search yet */}
            {suggestions.length === 0 && !loading && (
                 <p className="mt-4 text-sm text-slate-400">
                    Try searching for "Peaceful hiking trips" or "Urban food tours"
                 </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
