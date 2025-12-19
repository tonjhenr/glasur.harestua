import { ShoppingCart, Menu, X, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import logo from 'figma:asset/ef6a37961f64004c649f85d97770b18fa518692b.png';

type HeaderProps = {
  currentPage: 'home' | 'products' | 'admin' | 'login' | 'account';
  onNavigate: (page: 'home' | 'products' | 'admin' | 'login' | 'account') => void;
  cartItemCount: number;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
};

export function Header({ currentPage, onNavigate, cartItemCount, isLoggedIn, isAdmin, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as const, label: 'Hjem', showAlways: true },
    { id: 'products' as const, label: 'Produkter', showAlways: true },
    { id: 'account' as const, label: 'Min Side', showAlways: false, showForCustomer: true },
    { id: 'admin' as const, label: 'Admin', showAlways: true, showForCustomer: false }
  ].filter(item => 
    item.showAlways || 
    (item.id === 'account' && isLoggedIn && !isAdmin)
  );

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3"
          >
            <img src={logo} alt="Glasur.Harestua" className="h-14 w-auto" />
            <span className="text-xl text-white">Glasur.Harestua</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-white text-primary'
                    : 'hover:bg-primary-foreground/10'
                }`}
              >
                {item.label}
              </button>
            ))}
            {currentPage === 'products' && cartItemCount > 0 && (
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </div>
            )}
            {isLoggedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="text-primary bg-white border-white hover:bg-white/90"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logg ut
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 hover:bg-primary-foreground/10 rounded-lg"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pb-2 flex flex-col gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg text-left transition-colors ${
                  currentPage === item.id
                    ? 'bg-white text-primary'
                    : 'hover:bg-primary-foreground/10'
                }`}
              >
                {item.label}
                {item.id === 'products' && cartItemCount > 0 && (
                  <span className="ml-2 bg-white text-primary px-2 py-1 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            ))}
            {isLoggedIn && (
              <button
                onClick={() => {
                  onLogout();
                  setMenuOpen(false);
                }}
                className="px-4 py-3 rounded-lg text-left hover:bg-primary-foreground/10 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logg ut
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}