import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CreditCard } from 'lucide-react';
import { CartItem } from '../App';
import { toast } from 'sonner@2.0.3';

type CheckoutDialogProps = {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onOrderComplete: () => void;
};
type Hentedag = "saturday" | "sunday" | null;
type Hentested =
  | "butikk"
  | "kiwi-grua"
  | "kiwi-harestua"
  | null;

export function CheckoutDialog({ open, onClose, cart, total, onOrderComplete }: CheckoutDialogProps) {
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [name, setName] = useState('');
  const [hentedag, setHentedag] = useState<Hentedag>(null);
  const [hentested, setHentested] = useState<Hentested>(null);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'vipps'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const handleInfoSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !hentedag || !hentested) {
      toast.error('Vennligst fyll ut alle påkrevde felt');
      return;
    }

    // Validate phone: exactly 8 digits
    const phoneDigits = phone.replace(/\D/g, ''); // Remove all non-digits
    if (phoneDigits.length !== 8) {
      toast.error('Telefonnummer må inneholde nøyaktig 8 siffer');
      return;
    }
    const formData = new FormData(e.target);
    formData.append("access_key", "b8124d32-df0d-4b12-8ada-55b50ccdda4d");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    setResult(data.success ? 'Success' : 'Error');
      if (data.success) {
      setStep('payment');
    };
  
  };

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        toast.error('Vennligst fyll ut all kortinformasjon');
        return;
      }
    }
    
    toast.success('Betaling gjennomført! Takk for din bestilling.');
    onOrderComplete();
    handleClose();
  };

  const handleClose = () => {
    setStep('info');
    setName('');
    setHentedag(null);
    setHentested(null);
    setPhone('');
    setMessage('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setPaymentMethod('card');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'info' ? 'Bestillingsinformasjon' : 'Betaling'}
          </DialogTitle>
          <DialogDescription>
            {step === 'info' 
              ? 'Fyll ut informasjon for din bestilling'
              : 'Velg betalingsmetode'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'info' ? (
          <form onSubmit={handleInfoSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Navn *</Label>
              <Input
                id="name"
                name= "navn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ola Nordmann"
                required
              />
            </div>
              <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer *</Label>
              <Input
                id="phone"
                name="telefonnummer"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="123 45 678"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>
              <input
                    type="radio"
                    name="hentedag"
                    value="saturday"
                    checked={hentedag === "saturday"}
                    onChange={() => {
                      setHentedag("saturday");
                      setHentested(null); // reset når dag endres
                    }}
                  /> Bestillingen hentes lørdag   
                  </Label> 
               {hentedag === "saturday" && (
                <div className="space-y-2 mt-4">
                
                  <div className="grid grid-cols-3 gap-1">
    <label
      className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition text-sm
        ${
          hentested === "butikk"
            ? "border-gray-900 bg-gray-100"
            : "border-gray-300 hover:bg-gray-50"
        }`}
    >
                    <input
                      type="radio"
                      name="hentested"
                      value="butikk"
                      checked={hentested === "butikk"}
                      onChange={() => setHentested("butikk")}
                    />
                    Lugn Kafé
                  </label>

                      <label
      className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition text-sm
        ${
          hentested === "kiwi-grua"
            ? "border-gray-900 bg-gray-100"
            : "border-gray-300 hover:bg-gray-50"
        }`}
    >
                    <input
                      type="radio"
                      name="hentested"
                      value="kiwi-grua"
                      checked={hentested === "kiwi-grua"}
                      onChange={() => setHentested("kiwi-grua")}
                    />
                    Kiwi Grua
                  </label>

                     <label
      className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition text-sm
        ${
          hentested === "kiwi-harestua"
            ? "border-gray-900 bg-gray-100"
            : "border-gray-300 hover:bg-gray-50"
        }`}
    >
                    <input
                      type="radio"
                      name="hentested"
                      value="kiwi-harestua"
                      checked={hentested === "kiwi-harestua"}
                      onChange={() => setHentested("kiwi-harestua")}
                    />
                    Kiwi Harestua
                  </label>
                </div>
                </div>
              )}
              <Label>
              <input
                    type="radio"
                    name="hentedag"
                    value="sunday"
                    checked={hentedag === "sunday"}
                    onChange={() => {
                      setHentedag("sunday");
                      setHentested(null); // reset når dag endres
                    }}
                  /> Bestillingen hentes søndag   
                  </Label>  
                  {hentedag === "sunday" && (
                <div className="space-y-2 mt-4">
                
                  <div className="grid grid-cols-3 gap-1">
    <label
      className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition text-sm
        ${
          hentested === "butikk"
            ? "border-gray-900 bg-gray-100"
            : "border-gray-300 hover:bg-gray-50"
        }`}
    >
                    <input
                      type="radio"
                      name="hentested"
                      value="butikk"
                      checked={hentested === "butikk"}
                      onChange={() => setHentested("butikk")}
                    />
                    Lugn Kafé
                  </label>

                      <label
      className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition text-sm
        ${
          hentested === "kiwi-grua"
            ? "border-gray-900 bg-gray-100"
            : "border-gray-300 hover:bg-gray-50"
        }`}
    >
                    <input
                      type="radio"
                      name="hentested"
                      value="kiwi-grua"
                      checked={hentested === "kiwi-grua"}
                      onChange={() => setHentested("kiwi-grua")}
                    />
                    Kiwi Grua
                  </label>

                     <label
      className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition text-sm
        ${
          hentested === "kiwi-harestua"
            ? "border-gray-900 bg-gray-100"
            : "border-gray-300 hover:bg-gray-50"
        }`}
    >
                    <input
                      type="radio"
                      name="hentested"
                      value="kiwi-harestua"
                      checked={hentested === "kiwi-harestua"}
                      onChange={() => setHentested("kiwi-harestua")}
                    />
                    Kiwi Harestua
                  </label>
                </div>
                </div>
              )}       
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Annen beskjed</Label>
              <Textarea
                id="message"
                name="melding"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Eventuelle kommentarer til bestillingen..."
                rows={3}
              />
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between mb-4">
                <span>Totalt å betale</span>
                <span className="text-xl">{total} kr</span>
                <input type="hidden" name="sum" value={total}></input>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Avbryt
              </Button>
              <Button type="submit">
                Gå til betaling
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <Label>Velg betalingsmetode</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'vipps')}>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer flex-1 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Betal med kort
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="vipps" id="vipps" />
                  <Label htmlFor="vipps" className="cursor-pointer flex-1">
                    Betal med Vipps
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Kortnummer</Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Utløpsdato</Label>
                    <Input
                      id="cardExpiry"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/ÅÅ"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      id="cardCvc"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'vipps' && (
              <div className="p-4 border rounded-lg bg-accent/50">
                <p className="text-sm text-center">
                  Du vil bli videresendt til Vipps for å fullføre betalingen.
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex justify-between mb-4">
                <span>Totalt å betale</span>
                <span className="text-xl">{total} kr</span>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep('info')}>
                Tilbake
              </Button>
              <Button onClick={handlePayment}>
                Kjøp
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}