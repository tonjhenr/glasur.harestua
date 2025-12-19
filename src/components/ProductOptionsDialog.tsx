import { useState } from 'react';
import { Product } from '../App';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Minus, Plus } from 'lucide-react';

type ProductOptionsDialogProps = {
  product: Product;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variant: string | null, quantity: number) => void;
};

export function ProductOptionsDialog({ product, open, onClose, onAddToCart }: ProductOptionsDialogProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>(product.variants?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  const calculatePrice = () => {
    // Special pricing for Focaccia: 3 for 90 kr
    if (product.name === 'Focaccia 230g' && quantity >= 3) {
      const sets = Math.floor(quantity / 3);
      const remainder = quantity % 3;
      return (sets * 90) + (remainder * product.price);
    }
    return product.price * quantity;
  };

  const handleAddToCart = () => {
    onAddToCart(product, product.variants ? selectedVariant : null, quantity);
    onClose();
    setQuantity(1);
    setSelectedVariant(product.variants?.[0] || '');
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <Label>Velg type</Label>
              <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg type" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((variant) => (
                    <SelectItem key={variant} value={variant}>
                      {variant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="space-y-3">
            <Label>Antall</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl w-12 text-center">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t">
            <span>Pris</span>
            <span className="text-xl">{calculatePrice()} kr</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={handleAddToCart}>
            Legg til i handlekurv
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}