import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import DestinationCard from './components/DestinationCard';
import { Destination, User, Booking, ViewState } from './types';
import { INITIAL_DESTINATIONS } from './constants';
import { generateDestinationDetails, getTravelAdvice } from './services/geminiService';
import { 
  Loader2, 
  Plus, 
  Calendar, 
  User as UserIcon, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Send,
  Sparkles,
  MapPin,
  ShieldCheck,
  Compass
} from 'lucide-react';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingGuests, setBookingGuests] = useState(1);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  // Admin State - Add Destination
  const [newDestName, setNewDestName] = useState('');
  const [newDestLocation, setNewDestLocation] = useState('');
  const [newDestGenerating, setNewDestGenerating] = useState(false);

  // Chat/AI State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Initial Check (Mock Persistence)
  useEffect(() => {
    // In a real app, check localStorage or cookie
  }, []);

  // -- Navigation Handlers --
  const navigateTo = (v: ViewState) => {
    setView(v);
    window.scrollTo(0, 0);
    if (v !== ViewState.DESTINATION_DETAILS) {
        setSelectedDestinationId(null);
        setIsBookingSuccess(false);
    }
  };

  const handleDestinationClick = (id: string) => {
    setSelectedDestinationId(id);
    navigateTo(ViewState.DESTINATION_DETAILS);
  };

  // -- Auth Handlers --
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'admin@uncharted.com' && loginPassword === 'admin') {
      setUser({ id: 'admin1', name: 'Admin User', email: loginEmail, role: 'admin' });
      navigateTo(ViewState.ADMIN_PANEL);
    } else if (loginEmail && loginPassword) {
      setUser({ id: 'user1', name: 'John Traveller', email: loginEmail, role: 'user' });
      navigateTo(ViewState.HOME);
    } else {
      setLoginError('Invalid credentials. Try admin@uncharted.com / admin');
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigateTo(ViewState.HOME);
    setLoginEmail('');
    setLoginPassword('');
  };

  // -- Booking Handlers --
  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        navigateTo(ViewState.LOGIN);
        return;
    }
    const dest = destinations.find(d => d.id === selectedDestinationId);
    if (!dest) return;

    setIsBookingLoading(true);

    const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        destinationId: dest.id,
        destinationName: dest.name,
        userId: user.id,
        userName: user.name,
        date: bookingDate,
        guests: bookingGuests,
        totalPrice: dest.price * bookingGuests,
        status: 'pending'
    };

    try {
        // Send data to Formspree
        const response = await fetch("https://formspree.io/f/xwpgnjvk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                destination: dest.name,
                user_name: user.name,
                user_email: user.email,
                date: bookingDate,
                guests: bookingGuests,
                total_price: dest.price * bookingGuests,
                booking_id: newBooking.id
            })
        });

        if (response.ok) {
            setBookings(prev => [...prev, newBooking]);
            setIsBookingSuccess(true);
        } else {
            alert("There was an issue submitting your booking. Please try again.");
        }
    } catch (error) {
        console.error("Booking Error:", error);
        alert("Failed to connect to booking server.");
    } finally {
        setIsBookingLoading(false);
    }
  };

  // -- Admin Handlers --
  const handleAddDestination = async () => {
    if (!newDestName || !newDestLocation) return;
    setNewDestGenerating(true);

    try {
        // Use AI to fill in details
        const aiData = await generateDestinationDetails(newDestName);
        
        const newDest: Destination = {
            id: Math.random().toString(36).substr(2, 9),
            name: newDestName,
            location: newDestLocation,
            description: aiData.description,
            price: aiData.priceEstimate,
            image: `https://picsum.photos/800/600?random=${Math.random()}`,
            duration: '5 Days',
            rating: 0, // New
            features: ['AI Recommended'],
            itinerary: aiData.itinerary
        };
        
        setDestinations(prev => [newDest, ...prev]);
        setNewDestName('');
        setNewDestLocation('');
        alert('Destination added successfully with AI-generated content!');
    } catch (error) {
        alert('Failed to generate destination details. Please try again or check API Key.');
    } finally {
        setNewDestGenerating(false);
    }
  };

  const handleUpdateStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  // -- Chat Handler --
  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    setChatLoading(true);

    const response = await getTravelAdvice(msg);
    setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    setChatLoading(false);
  };

  // -- Views Components --

  const HomeView = () => (
    <>
      <Hero 
        onSearch={(q) => console.log(q)} 
        onSuggestionClick={(s) => {
            // Simplified: just alert for now, in real app would filter or generate
            alert(`Searching for ${s}... (Demo: Suggestion Clicked)`);
        }} 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map(dest => (
            <DestinationCard key={dest.id} destination={dest} onClick={handleDestinationClick} />
          ))}
        </div>
      </div>
      
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!chatOpen ? (
            <button 
                onClick={() => setChatOpen(true)}
                className="bg-brand-600 hover:bg-brand-500 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
            >
                <MessageSquare size={24} />
            </button>
        ) : (
            <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-slate-200">
                <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2"><Sparkles size={16}/> Travel Assistant</h3>
                    <button onClick={() => setChatOpen(false)}><XCircle size={20}/></button>
                </div>
                <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-4">
                    {chatMessages.length === 0 && (
                        <p className="text-slate-400 text-sm text-center mt-10">Ask me anything about travel!</p>
                    )}
                    {chatMessages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-xl p-3 text-sm ${m.role === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {chatLoading && <div className="flex justify-start"><div className="bg-slate-200 p-3 rounded-xl rounded-bl-none text-xs text-slate-500 animate-pulse">Thinking...</div></div>}
                </div>
                <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                    <input 
                        className="flex-1 text-sm border border-slate-300 rounded-full px-4 py-2 focus:outline-none focus:border-brand-500"
                        placeholder="Type a message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                    />
                    <button onClick={handleChatSend} className="bg-brand-600 text-white p-2 rounded-full hover:bg-brand-700">
                        <Send size={16} />
                    </button>
                </div>
            </div>
        )}
      </div>
    </>
  );

  const DestinationDetailsView = () => {
    const dest = destinations.find(d => d.id === selectedDestinationId);
    if (!dest) return <div>Destination not found</div>;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigateTo(ViewState.HOME)} className="text-brand-600 hover:underline mb-4">&larr; Back to Destinations</button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Left Column: Images and Info */}
           <div>
               <img src={dest.image} alt={dest.name} className="w-full h-96 object-cover rounded-2xl shadow-lg mb-8" />
               <h1 className="text-4xl font-bold text-slate-900 mb-2">{dest.name}</h1>
               <p className="text-lg text-slate-500 mb-6 flex items-center gap-2"><MapPin size={20}/> {dest.location}</p>
               
               <div className="prose text-slate-700 mb-8">
                   <h3 className="text-xl font-semibold mb-2">About this trip</h3>
                   <p className="leading-relaxed">{dest.description}</p>
               </div>

               <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
                   <h3 className="text-lg font-bold text-brand-900 mb-4">Highlights</h3>
                   <ul className="grid grid-cols-2 gap-2">
                       {dest.features.map((f, i) => (
                           <li key={i} className="flex items-center gap-2 text-brand-700 text-sm">
                               <CheckCircle size={16} className="text-brand-500"/> {f}
                           </li>
                       ))}
                   </ul>
               </div>
           </div>

           {/* Right Column: Itinerary and Booking */}
           <div className="space-y-8">
               {/* Booking Card */}
               <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:sticky lg:top-24">
                   <div className="flex justify-between items-end mb-6">
                       <div>
                           <span className="text-slate-400 text-sm">Total Price</span>
                           <div className="text-3xl font-bold text-slate-900">${dest.price.toLocaleString()}</div>
                       </div>
                       <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Available Now</div>
                   </div>

                   {!isBookingSuccess ? (
                       <form onSubmit={handleBook} className="space-y-4">
                           <div>
                               <label className="block text-sm font-medium text-slate-700 mb-1">Select Date</label>
                               <div className="relative">
                                   <Calendar className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                                   <input 
                                       type="date" 
                                       required
                                       className="pl-10 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2 border"
                                       value={bookingDate}
                                       onChange={(e) => setBookingDate(e.target.value)}
                                   />
                               </div>
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-slate-700 mb-1">Guests</label>
                               <div className="relative">
                                   <UserIcon className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                                   <input 
                                       type="number" 
                                       min="1" 
                                       max="10"
                                       required
                                       className="pl-10 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2 border"
                                       value={bookingGuests}
                                       onChange={(e) => setBookingGuests(parseInt(e.target.value))}
                                   />
                               </div>
                           </div>
                           <button 
                                type="submit" 
                                disabled={isBookingLoading}
                                className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                           >
                               {isBookingLoading ? (
                                   <>
                                     <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                     Processing...
                                   </>
                               ) : (
                                   user ? 'Book Now' : 'Login to Book'
                               )}
                           </button>
                           {!user && <p className="text-xs text-center text-slate-400">You will be redirected to login</p>}
                       </form>
                   ) : (
                       <div className="text-center py-8">
                           <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                               <CheckCircle className="h-8 w-8 text-green-600" />
                           </div>
                           <h3 className="text-lg font-medium text-slate-900">Booking Confirmed!</h3>
                           <p className="mt-2 text-sm text-slate-500">Check your dashboard for details.</p>
                           <button onClick={() => navigateTo(ViewState.DASHBOARD)} className="mt-6 text-brand-600 hover:text-brand-500 font-medium text-sm">
                               Go to My Trips &rarr;
                           </button>
                       </div>
                   )}
               </div>

               {/* Itinerary */}
               {dest.itinerary && (
                   <div>
                       <h3 className="text-xl font-bold text-slate-900 mb-4">Itinerary</h3>
                       <div className="space-y-6 border-l-2 border-brand-200 ml-3 pl-8 relative">
                           {dest.itinerary.map((day, idx) => (
                               <div key={idx} className="relative">
                                   <span className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 ring-4 ring-white">
                                       <span className="text-xs font-bold text-brand-600">{day.day}</span>
                                   </span>
                                   <h4 className="text-lg font-semibold text-slate-900">{day.title}</h4>
                                   <ul className="mt-2 space-y-1 text-slate-600 list-disc list-inside text-sm">
                                       {day.activities.map((act, i) => (
                                           <li key={i}>{act}</li>
                                       ))}
                                   </ul>
                               </div>
                           ))}
                       </div>
                   </div>
               )}
           </div>
        </div>
      </div>
    );
  };

  const LoginView = () => (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <Compass className="mx-auto h-12 w-12 text-brand-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-600">
             Or use <span className="font-mono text-xs bg-slate-100 p-1 rounded">admin@uncharted.com / admin</span>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-b-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
          </div>
          {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Trips</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {bookings.filter(b => b.userId === user?.id).length === 0 ? (
             <div className="p-10 text-center text-slate-500">You haven't booked any trips yet.</div>
        ) : (
             <ul className="divide-y divide-slate-200">
                {bookings.filter(b => b.userId === user?.id).map((booking) => (
                    <li key={booking.id} className="p-6 hover:bg-slate-50">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-brand-600">{booking.destinationName}</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Date: {booking.date} | Guests: {booking.guests}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-slate-900">${booking.totalPrice.toLocaleString()}</div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-1 ${
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
             </ul>
        )}
      </div>
    </div>
  );

  const AdminPanelView = () => {
    // Only allow admin
    if (user?.role !== 'admin') {
        setTimeout(() => navigateTo(ViewState.HOME), 0);
        return null;
    }

    const allBookings = bookings; // In real app, fetch all

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <ShieldCheck className="text-brand-600"/> Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Destination Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Add New Destination</h2>
                        <p className="text-sm text-slate-500 mb-4">
                            Enter the basic info, and our AI will generate the description, price, and itinerary.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Destination Name</label>
                                <input 
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm border p-2"
                                    placeholder="e.g. Bora Bora"
                                    value={newDestName}
                                    onChange={(e) => setNewDestName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Location/Country</label>
                                <input 
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm border p-2"
                                    placeholder="e.g. French Polynesia"
                                    value={newDestLocation}
                                    onChange={(e) => setNewDestLocation(e.target.value)}
                                />
                            </div>
                            <button 
                                onClick={handleAddDestination}
                                disabled={newDestGenerating || !newDestName || !newDestLocation}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none disabled:opacity-50"
                            >
                                {newDestGenerating ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" /> Generating Content...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} className="mr-2" /> Generate & Add
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bookings List Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
                        <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
                            <h3 className="text-lg leading-6 font-medium text-slate-900">All User Bookings</h3>
                        </div>
                        <ul className="divide-y divide-slate-200">
                            {allBookings.length === 0 ? <li className="p-4 text-center text-slate-500">No bookings found.</li> : allBookings.map((booking) => (
                                <li key={booking.id} className="p-4 sm:px-6 hover:bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm">
                                            <p className="font-medium text-brand-600 truncate">{booking.destinationName}</p>
                                            <p className="text-slate-500">User: {booking.userName}</p>
                                            <p className="text-slate-500">Date: {booking.date}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {booking.status}
                                            </span>
                                            {booking.status === 'pending' && (
                                                <div className="flex gap-2 mt-1">
                                                    <button 
                                                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                                        className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                                    >Confirm</button>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                    >Cancel</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <Layout 
      user={user} 
      onNavigate={navigateTo} 
      onLogout={handleLogout}
      currentView={view}
    >
      {view === ViewState.HOME && <HomeView />}
      {view === ViewState.DESTINATION_DETAILS && <DestinationDetailsView />}
      {view === ViewState.LOGIN && <LoginView />}
      {view === ViewState.DASHBOARD && <DashboardView />}
      {view === ViewState.ADMIN_PANEL && <AdminPanelView />}
    </Layout>
  );
};

export default App;