import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { CartItem } from '../App';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CheckoutDialog } from './CheckoutDialog';

type CartProps = {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, variant?: string) => void;
  onClearCart: () => void;
};

export function Cart({ cart, onUpdateQuantity, onClearCart }: CartProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  // Calculate total with special pricing for focaccia (3 for 90 kr)
  const calculateTotal = () => {
    let total = 0;
    
    cart.forEach(item => {
      // Check if this is focaccia (case insensitive check)
      const isFocaccia = item.product.name.toLowerCase().includes('focaccia');
      
      if (isFocaccia && item.quantity >= 3) {
        // Apply 3 for 90 kr discount
        const sets = Math.floor(item.quantity / 3);
        const remainder = item.quantity % 3;
        total += (sets * 90) + (remainder * item.product.price);
      } else {
        // Regular pricing
        total += item.product.price * item.quantity;
      }
    });
    
    return total;
  };

  const total = calculateTotal();

  // Calculate price for individual item (considering focaccia discount)
  const calculateItemPrice = (item: typeof cart[0]) => {
    const isFocaccia = item.product.name.toLowerCase().includes('focaccia');
    
    if (isFocaccia && item.quantity >= 3) {
      const sets = Math.floor(item.quantity / 3);
      const remainder = item.quantity % 3;
      return (sets * 90) + (remainder * item.product.price);
    }
    
    return item.product.price * item.quantity;
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    setCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    onClearCart();
    setCheckoutOpen(false);
  };

  if (cart.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
          <p className="text-neutral-500">Handlekurven er tom</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {cart.map((item, index) => {
                const itemKey = `${item.product.id}-${item.variant || 'no-variant'}`;
                return (
                  <div key={itemKey} className="pb-4 border-b last:border-b-0 space-y-3">
                    {/* Product name and variant */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium leading-tight break-words flex-1 min-w-0">
                        {item.product.name}
                        {item.variant && (
                          <span className="text-sm text-muted-foreground ml-2 whitespace-nowrap">
                            ({item.variant})
                          </span>
                        )}
                      </h4>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="flex-shrink-0 h-8 w-8"
                        onClick={() => onUpdateQuantity(item.product.id, 0, item.variant)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {/* Price and quantity controls */}
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-neutral-600 flex-shrink-0">
                        {item.product.price} kr × {item.quantity} = {calculateItemPrice(item)} kr
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.variant)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.variant)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between mb-4">
              <span>Totalt</span>
              <span>{total} kr</span>
            </div>
            <Button onClick={handleProceedToCheckout} className="w-full mb-2">
              Gå videre
            </Button>
            <Button onClick={onClearCart} variant="outline" className="w-full">
              Tøm handlekurv
            </Button>
          </CardContent>
        </Card>
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        total={total}
        onOrderComplete={handleOrderComplete}
      />
    </>
  );
}