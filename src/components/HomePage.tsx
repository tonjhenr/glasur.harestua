import { Clock, MapPin, Phone, Quote } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { NewsItem } from "../App";
import logo from "figma:asset/ef6a37961f64004c649f85d97770b18fa518692b.png";

type HomePageProps = {
  news: NewsItem[];
};

export function HomePage({ news }: HomePageProps) {
  // Sort news by date, newest first
  const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <img
          src={logo}
          alt="Glasur.Harestua"
          className="h-32 w-auto mx-auto mb-6"
        />
        <p className="text-2xl text-primary italic" style={{ fontFamily: 'Georgia, serif' }}>
          Hjemmebakt med kjærlighet
        </p>
      </div>
      {/* News Section */}
      <div>
        <h2 className="mb-6 text-3xl">Nyheter og informasjon</h2>
        <div className="grid grid-cols-1 gap-6 mb-8">
          {sortedNews.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-neutral-500">
                  {new Date(item.date).toLocaleDateString(
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

        {/* Customer Testimonial */}
        <div className="mb-12">
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
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p>Man-Fre: Stengt</p>
                <p>Lør: 09:00-15:00</p>
                <p>Søn: 09:00-17:00</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <p>Harestua</p>
                <p>Lunner kommune</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Phone className="h-8 w-8 text-primary" />
              <div>
                <p>Kontakt oss</p>
                <p>for bestillinger</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}