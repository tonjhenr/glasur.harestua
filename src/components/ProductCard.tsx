import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../App';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProductOptionsDialog } from './ProductOptionsDialog';
import { toast } from 'sonner@2.0.3';

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product, variant?: string) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleAddToCart = (product: Product, variant: string | null, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, variant || undefined);
    }
    const variantText = variant ? ` (${variant})` : '';
    toast.success(`${quantity}x ${product.name}${variantText} lagt til i handlekurven`);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
        <div className="aspect-square overflow-hidden bg-neutral-100">
          {product.image.startsWith('figma:asset') || product.image.startsWith('https://') ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageWithFallback
              src={`https://source.unsplash.com/400x400/?${encodeURIComponent(product.image)}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <CardContent className="pt-4 flex-grow">
          <h3 className="mb-2">{product.name}</h3>
          <p className="text-neutral-600 mb-3">{product.description}</p>
          <p className="text-primary">{product.price} kr</p>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button onClick={handleOpenDialog} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Legg til i handlekurv
          </Button>
        </CardFooter>
      </Card>

      <ProductOptionsDialog
        product={product}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}