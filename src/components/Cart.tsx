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
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

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
                  <div key={itemKey} className="flex items-center gap-3 pb-4 border-b last:border-b-0">
                    <div className="flex-1">
                      <h4 className="mb-1">
                        {item.product.name}
                        {item.variant && (
                          <span className="text-sm text-muted-foreground ml-2">
                            ({item.variant})
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {item.product.price} kr × {item.quantity} = {item.product.price * item.quantity} kr
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.variant)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.variant)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onUpdateQuantity(item.product.id, 0, item.variant)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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