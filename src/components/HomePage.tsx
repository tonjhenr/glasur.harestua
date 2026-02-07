import { Clock, MapPin, Phone, Quote } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { NewsItem } from "../App";
import { Button } from "./ui/button";
import focacciaImg from "../assets/img/focaccia.jpg";
import konfektImg from "../assets/img/konfekt.jpg";
import wienerbrodImg from "../assets/img/WIENERBRODSNURRER.jpg";
import hamburgerImg from "../assets/img/hamburgerbrod.jpg";


type HomePageProps = {
  news: NewsItem[];
  onNavigate?: (page: 'home' | 'products' | 'admin' | 'login' | 'customer-account') => void;
  onCategorySelect?: (category: string) => void;
};

export function HomePage({ news, onNavigate, onCategorySelect }: HomePageProps) {
  // Sort news by date, newest first
  const sortedNews = [...news].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

const productImages = [wienerbrodImg, focacciaImg, hamburgerImg, konfektImg];

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden"
        style={{ 
          height: 'calc(100vh - 64px)',
          minHeight: '500px'
        }}
      >
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          {/* Content - Left side */}
          <div className="z-10 flex-1 max-w-2xl">
            <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Ferske bakevarer<br />
              <span className="text-[#d4a373]">hver dag</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-xl">
              Velkommen til glaSUR Bakeri. Vi baker ferske brød, focaccia og bakevarer hver morgen med de beste ingrediensene.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-[#d4a373] hover:bg-[#c49363] text-white text-lg px-8"
                onClick={() => {
                  onCategorySelect?.('alle');
                  onNavigate?.('products');
                }}
              >
                Se produkter
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white hover:bg-[#c49363] text-lg px-8"
                onClick={() => {
                  onCategorySelect?.('bakst');
                  onNavigate?.('products');
                }}
              >
                Bestill lunsj
              </Button>
            </div>
          </div>

          {/* Product Images - Right side (hidden on mobile) */}
          <div className="hidden lg:grid grid-cols-2 gap-4 flex-1 max-w-xl ml-8">
            {productImages.map((img, idx) => (
              <div 
                key={idx}
                className="relative overflow-hidden rounded-lg aspect-square"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${idx * 0.1}s both`
                }}
              >
                <img 
                  src={img} 
                  alt={`Produkt ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Add CSS animation */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>

      {/* Product Images Section - Visible after scroll on mobile */}
      <div className="lg:hidden bg-neutral-900 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-4">
          {productImages.map((img, idx) => (
            <div 
              key={idx}
              className="relative overflow-hidden rounded-lg aspect-square"
            >
              <img 
                src={img} 
                alt={`Produkt ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* News Section */}
        <div>
          <div className="text-center mb-12">
          <p className="text-primary font-medium tracking-widest uppercase text-lg mb-2">
            Siste nytt
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Nyheter fra bakeriet
          </h2>
        </div>
          <div className="grid grid-cols-1 gap-6 mb-8">
            {sortedNews.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-neutral-500">
                    {new Date(item.created_at).toLocaleDateString(
                      "nb-NO",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </CardHeader>
                <CardContent>
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="whitespace-pre-line">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* quotes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <Card className="bg-secondary border-accent">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Quote className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg italic text-foreground mb-2">
                      "De smaker helt himmelsk"
                    </p>
                    <p className="text-muted-foreground">
                      - Kunde om Wienerbrødsnurrene
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary border-accent">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Quote className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg italic text-foreground mb-2">
                      "De er nam nam"
                    </p>
                    <p className="text-muted-foreground">
                      - Kunde om Wienerbrødsnurrene
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p>Man: Stengt</p>
                  <p>Tir-Fre: 08:00-17:00</p>
                  <p>Lør/Søn: 09:00-15:00</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <MapPin className="h-8 w-8 text-primary" />
                <div>
                  <p>Garverivegen 4</p>
                  <p>2740 Roa</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <Phone className="h-8 w-8 text-primary" />
                <div>
                  <p>post@glasurbakeri.no</p>
                  <p>+47 22 33 44 55</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}