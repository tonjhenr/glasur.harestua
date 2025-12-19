import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Mail, Phone, MapPin, Lock, Package } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export type CustomerData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

export type Order = {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
};

type CustomerAccountPageProps = {
  customerData: CustomerData;
  orders: Order[];
  onUpdateProfile: (data: Partial<CustomerData>) => void;
  onChangePassword: (oldPassword: string, newPassword: string) => boolean;
};

export function CustomerAccountPage({ customerData, orders, onUpdateProfile, onChangePassword }: CustomerAccountPageProps) {
  const [name, setName] = useState(customerData.name);
  const [email, setEmail] = useState(customerData.email);
  const [phone, setPhone] = useState(customerData.phone);
  const [address, setAddress] = useState(customerData.address);
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, email, phone, address });
    toast.success('Profil oppdatert!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passordene matcher ikke');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Passordet må være minst 6 tegn');
      return;
    }

    const success = onChangePassword(oldPassword, newPassword);
    
    if (success) {
      toast.success('Passord endret!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error('Feil gammelt passord');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-amber-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-neutral-600';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'Fullført';
      case 'pending':
        return 'Under behandling';
      case 'cancelled':
        return 'Kansellert';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="mb-6">Min Side</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="password">Passord</TabsTrigger>
          <TabsTrigger value="orders">Bestillinger</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Min profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Fullt navn
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-post
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefonnummer
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+47 123 45 678"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Gate 123, 1234 Sted"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Lagre endringer
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Password Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Endre passord
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="old-password">Gammelt passord</Label>
                  <Input
                    id="old-password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-password">Nytt passord</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirm-password">Bekreft nytt passord</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Endre passord
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Bestillingshistorikk
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Du har ingen bestillinger ennå
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-2">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Bestilling #{order.id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.date).toLocaleDateString('nb-NO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span>{item.price * item.quantity} kr</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2 flex justify-between">
                            <span>Totalt</span>
                            <span>{order.total} kr</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
