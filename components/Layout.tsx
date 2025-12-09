import React from 'react';
import { User, ViewState } from '../types';
import { Compass, User as UserIcon, LogOut, Menu, X, ShieldCheck, MapPin } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  currentView: ViewState;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onNavigate, onLogout, currentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinkClass = (view: ViewState) => 
    `cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentView === view 
        ? 'bg-brand-600 text-white' 
        : 'text-slate-600 hover:bg-brand-50 hover:text-brand-600'
    }`;

  const MobileNavLink = ({ view, label }: { view: ViewState, label: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
      }}
      className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
        currentView === view 
          ? 'bg-brand-600 text-white' 
          : 'text-slate-600 hover:bg-brand-50 hover:text-brand-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer gap-2"
                onClick={() => onNavigate(ViewState.HOME)}
              >
                <Compass className="h-8 w-8 text-brand-600" />
                <span className="font-bold text-xl tracking-tight text-slate-900">Uncharted Escape</span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <button onClick={() => onNavigate(ViewState.HOME)} className={navLinkClass(ViewState.HOME)}>Home</button>
              
              {!user ? (
                <button onClick={() => onNavigate(ViewState.LOGIN)} className={navLinkClass(ViewState.LOGIN)}>Login</button>
              ) : (
                <>
                  <button onClick={() => onNavigate(ViewState.DASHBOARD)} className={navLinkClass(ViewState.DASHBOARD)}>My Trips</button>
                  {user.role === 'admin' && (
                     <button onClick={() => onNavigate(ViewState.ADMIN_PANEL)} className={navLinkClass(ViewState.ADMIN_PANEL)}>
                       <span className="flex items-center gap-1"><ShieldCheck size={16}/> Admin</span>
                     </button>
                  )}
                  <div className="flex items-center ml-4 space-x-2 text-sm text-slate-500 border-l pl-4 border-slate-200">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <UserIcon size={16} /> {user.name}
                    </span>
                    <button 
                      onClick={onLogout} 
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink view={ViewState.HOME} label="Home" />
              {!user ? (
                <MobileNavLink view={ViewState.LOGIN} label="Login" />
              ) : (
                <>
                  <MobileNavLink view={ViewState.DASHBOARD} label="My Trips" />
                  {user.role === 'admin' && (
                     <MobileNavLink view={ViewState.ADMIN_PANEL} label="Admin Panel" />
                  )}
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Compass className="h-6 w-6 text-brand-500" />
                        <span className="font-bold text-lg">Uncharted Escape</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Discovering the world's hidden gems with the power of AI. 
                        We make your dream vacation a reality with curated experiences and seamless booking.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-brand-500">Quick Links</h3>
                    <ul className="space-y-2 text-slate-300 text-sm">
                        <li><a href="#" className="hover:text-white">Destinations</a></li>
                        <li><a href="#" className="hover:text-white">Special Packages</a></li>
                        <li><a href="#" className="hover:text-white">Travel Insurance</a></li>
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                    </ul>
                </div>
                <div>
                     <h3 className="text-lg font-semibold mb-4 text-brand-500">Contact</h3>
                     <ul className="space-y-2 text-slate-300 text-sm">
                        <li className="flex items-center gap-2"><MapPin size={16}/> 123 Adventure Lane, Utopia</li>
                        <li>support@unchartedescape.com</li>
                        <li>+1 (555) 012-3456</li>
                     </ul>
                </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} Uncharted Escape. All rights reserved.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
