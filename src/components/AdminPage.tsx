import { useState, useEffect } from 'react';
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
import { supabase, mapNyhetFromDB, mapNyhetToDB, NyheterDB } from '../assets/supabase-client';
import { projectId, publicAnonKey } from '../assets/info';

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
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch news from Supabase on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoadingNews(true);
    try {
      const { data, error } = await supabase
        .from('nyheter')
        .select('*');

      if (error) {
        console.error('Supabase error ved henting av nyheter:', error);
        toast.error('Kunne ikke hente nyheter fra database');
        return;
      }

      if (data) {
        // Map database format to app format
        const mappedNews = data.map((item: NyheterDB) => mapNyhetFromDB(item));
        onUpdateNews(mappedNews);
      }
    } catch (error) {
      console.error('Feil ved henting av nyheter:', error);
      toast.error('Kunne ikke hente nyheter');
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Sort news by date, newest first
  const sortedNews = [...news].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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

  const handleSaveNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = editingNews?.image; // Keep existing image by default

    // Upload new image if selected
    if (selectedImage) {
      setIsUploadingImage(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedImage);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c190d631/upload-image`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: uploadFormData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error uploading image:', errorData);
          toast.error('Kunne ikke laste opp bilde');
          setIsUploadingImage(false);
          return;
        }

        const data = await response.json();
        imageUrl = data.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Kunne ikke laste opp bilde');
        setIsUploadingImage(false);
        return;
      } finally {
        setIsUploadingImage(false);
      }
    }

    const newsItem = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      image: imageUrl,
    };

    // Map to database format (Norwegian columns)
    const dbNewsItem = mapNyhetToDB(newsItem);

    try {
      if (editingNews) {
        // Update existing news
        const { error } = await supabase
          .from('nyheter')
          .update(dbNewsItem)
          .eq('id', editingNews.id);

        if (error) {
          console.error('Supabase error ved oppdatering:', error);
          toast.error('Kunne ikke oppdatere nyhet');
          return;
        }
        toast.success('Nyhet oppdatert');
      } else {
        // Insert new news - created_at will be set automatically by Supabase
        const { error } = await supabase
          .from('nyheter')
          .insert([dbNewsItem]);

        if (error) {
          console.error('Supabase error ved lagring:', error);
          toast.error('Kunne ikke lagre nyhet');
          return;
        }
        toast.success('Nyhet lagt til');
      }

      // Refresh news list from database
      await fetchNews();
      setEditingNews(null);
      setIsNewsDialogOpen(false);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Feil ved lagring av nyhet:', error);
      toast.error('Noe gikk galt ved lagring');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm('Er du sikker på at du vil slette denne nyheten?')) {
      try {
        // Find the news item to get the image URL
        const newsItem = news.find(n => n.id === id);

        // Delete from database
        const { error } = await supabase
          .from('nyheter')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase error ved sletting:', error);
          toast.error('Kunne ikke slette nyhet');
          return;
        }

        // Delete image from storage if it exists and is from our bucket
        if (newsItem?.image && newsItem.image.includes('make-c190d631-news-images')) {
          try {
            await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-c190d631/delete-image`,
              {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${publicAnonKey}`,
                },
                body: JSON.stringify({ url: newsItem.image }),
              }
            );
          } catch (error) {
            console.error('Error deleting image:', error);
            // Continue even if image deletion fails
          }
        }

        toast.success('Nyhet slettet');
        // Refresh news list from database
        await fetchNews();
      } catch (error) {
        console.error('Feil ved sletting av nyhet:', error);
        toast.error('Noe gikk galt ved sletting');
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleOpenNewsDialog = (newsItem: NewsItem | null) => {
    setEditingNews(newsItem);
    setIsNewsDialogOpen(true);
    setSelectedImage(null);
    setImagePreview(newsItem?.image || null);
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
                <Button onClick={() => handleOpenNewsDialog(null)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Legg til nyhet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
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
                    <Label htmlFor="uploadImage">Last opp bilde</Label>
                    <Input
                      id="uploadImage"
                      name="uploadImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-neutral-500 mt-1">Velg et bilde fra din enhet (mobil eller PC)</p>
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Forhåndsvisning"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="mt-2"
                        >
                          <div className="h-4 w-4 mr-2" />
                          Fjern bilde
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isUploadingImage}>
                    {isUploadingImage ? 'Laster opp...' : 'Lagre'}
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
                    {new Date(item.created_at).toLocaleDateString('nb-NO')}
                  </p>
                </CardHeader>
                <CardContent>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="mb-4 whitespace-pre-line">{item.content}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenNewsDialog(item)}
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