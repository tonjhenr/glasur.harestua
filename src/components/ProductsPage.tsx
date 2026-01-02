import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product, CartItem } from '../App';
import { ProductCard } from './ProductCard';
import { Cart } from './Cart';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

type ProductsPageProps = {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product, variant?: string) => void;
  onUpdateCartQuantity: (productId: string, quantity: number, variant?: string) => void;
  onClearCart: () => void;
};

export function ProductsPage({ 
  products, 
  cart, 
  onAddToCart, 
  onUpdateCartQuantity,
  onClearCart 
}: ProductsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('alle');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);

  const categories = ['alle', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = selectedCategory === 'alle' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ open: boolean }>;
      const isOpen = Boolean(custom?.detail?.open);
      setProductDialogOpen(isOpen);
      if (isOpen) setSheetOpen(false);
    };

    window.addEventListener('product-options-dialog', handler as EventListener);
    return () => window.removeEventListener('product-options-dialog', handler as EventListener);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl">Våre produkter</h1>
        
        {/* Cart Button for Mobile */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="md:hidden relative static">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Handlekurv</SheetTitle>
              <SheetDescription>
                Se over dine valgte produkter og send bestilling.
              </SheetDescription>
            </SheetHeader>
            <Cart 
              cart={cart}
              onUpdateQuantity={onUpdateCartQuantity}
              onClearCart={onClearCart}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x pb-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="capitalize whitespace-nowrap category-button"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>

        {/* Cart Sidebar for Desktop */}
        {!productDialogOpen && (
          <div className="hidden md:block">
          <div className="sticky top-24">
            <h2 className="mb-4">Handlekurv</h2>
            <Cart 
              cart={cart}
              onUpdateQuantity={onUpdateCartQuantity}
              onClearCart={onClearCart}
            />
          </div>
          </div>
        )}
      </div>
    </div>
  );
}