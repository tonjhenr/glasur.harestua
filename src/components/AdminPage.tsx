import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Product, NewsItem } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

type AdminPageProps = {
  products: Product[];
  news: NewsItem[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateNews: (news: NewsItem[]) => void;
};

export function AdminPage({ products, news, onUpdateProducts, onUpdateNews }: AdminPageProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);

  // Sort news by date, newest first
  const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const product: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      image: formData.get('image') as string,
      category: formData.get('category') as string,
    };

    if (editingProduct) {
      onUpdateProducts(products.map(p => p.id === product.id ? product : p));
      toast.success('Produkt oppdatert');
    } else {
      onUpdateProducts([...products, product]);
      toast.success('Produkt lagt til');
    }

    setEditingProduct(null);
    setIsProductDialogOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Er du sikker på at du vil slette dette produktet?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
      toast.success('Produkt slettet');
    }
  };

  const handleSaveNews = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newsItem: NewsItem = {
      id: editingNews?.id || Date.now().toString(),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      date: formData.get('date') as string,
      image: formData.get('image') as string || undefined,
    };

    if (editingNews) {
      onUpdateNews(news.map(n => n.id === newsItem.id ? newsItem : n));
      toast.success('Nyhet oppdatert');
    } else {
      onUpdateNews([...news, newsItem]);
      toast.success('Nyhet lagt til');
    }

    setEditingNews(null);
    setIsNewsDialogOpen(false);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Er du sikker på at du vil slette denne nyheten?')) {
      onUpdateNews(news.filter(n => n.id !== id));
      toast.success('Nyhet slettet');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl">Administrasjon</h1>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Produkter</TabsTrigger>
          <TabsTrigger value="news">Nyheter</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl">Produktadministrasjon</h2>
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingProduct(null)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Legg til produkt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Rediger produkt' : 'Legg til produkt'}
                  </DialogTitle>
                  <DialogDescription>
                    Fyll ut informasjonen nedenfor for å {editingProduct ? 'oppdatere' : 'legge til'} produktet.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Navn</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={editingProduct?.name}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Beskrivelse</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingProduct?.description}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Pris (kr)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      defaultValue={editingProduct?.price}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Input
                      id="category"
                      name="category"
                      defaultValue={editingProduct?.category}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Bilde (søkeord for Unsplash)</Label>
                    <Input
                      id="image"
                      name="image"
                      defaultValue={editingProduct?.image}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Lagre
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-2">{product.description}</p>
                  <p className="mb-4">{product.price} kr</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsProductDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Rediger
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Slett
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl">Nyhetsadministrasjon</h2>
            <Dialog open={isNewsDialogOpen} onOpenChange={setIsNewsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingNews(null)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Legg til nyhet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingNews ? 'Rediger nyhet' : 'Legg til nyhet'}
                  </DialogTitle>
                  <DialogDescription>
                    Fyll ut informasjonen nedenfor for å {editingNews ? 'oppdatere' : 'legge til'} nyheten.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveNews} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Tittel</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingNews?.title}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Innhold</Label>
                    <Textarea
                      id="content"
                      name="content"
                      rows={5}
                      defaultValue={editingNews?.content}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Dato</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      defaultValue={editingNews?.date}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Bilde (søkeord for Unsplash)</Label>
                    <Input
                      id="image"
                      name="image"
                      defaultValue={editingNews?.image}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Lagre
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sortedNews.map(item => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-neutral-500">
                    {new Date(item.date).toLocaleDateString('nb-NO')}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 whitespace-pre-line">{item.content}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingNews(item);
                        setIsNewsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Rediger
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNews(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Slett
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}