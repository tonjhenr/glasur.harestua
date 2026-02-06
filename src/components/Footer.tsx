import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function Footer() {
  return (
    
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
       

    {/* Kolonner */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8 max-w-4xl mx-auto">

      {/* Column 1: About */}
      <div className="max-w-xs py-4">
        <h3 className="text-2xl font-bold mb-4">
          glaSUR Bakeri
        </h3>
        <div className="text-white/80 text-sm leading-relaxed space-y-2">
          <p>Nyåpent bakeri som tilbyr de fineste bakevarer.</p>
          <p>Vi bruker kun de beste ingrediensene.</p>
        </div>
      </div>

      {/* Column 2: Contact */}
      <div className="max-w-xs py-4">
        <h3 className="text-lg font-bold mb-4">Kontakt</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <a
              href="https://www.google.com/maps/place/Garverivegen+4,+2740+Roa/@60.2941919,10.6092323,17z/data=!3m1!4b1!4m6!3m5!1s0x4641a39c47dd9501:0x38592d138396e346!8m2!3d60.2941919!4d10.6118126!16s%2Fg%2F11c4dy2h7_?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D"
              className="text-white/80 hover:text-white transition-colors"
            >Garverivegen 4, 2740 Roa</a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 flex-shrink-0" />
            <span className="text-white/80">+47 22 33 44 55</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 flex-shrink-0" />
            <a
              href="mailto:post@glasurbakeri.no"
              className="text-white/80 hover:text-white transition-colors"
            >
              post@glasurbakeri.no
            </a>
          </div>
        </div>
      </div>

      {/* Column 3: Opening Hours */}
      <div className="max-w-xs py-4">
        <h3 className="text-lg font-bold mb-4">Åpningstider</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white/80">Mandag – Fredag</p>
              <p className="text-white font-medium">08:00 – 17:00</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white/80">Lørdag / Søndag</p>
              <p className="text-white font-medium">09:00 – 15:00</p>
            </div>
          </div>
        </div>
      </div>

    </div>

        {/* Social Media */}

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col items-center gap-4">
          <p className="text-white/70 font-medium">Følg oss på sosiale medier</p>
          <div className="flex items-center gap-6">
            <a href="https://www.facebook.com/profile.php?id=61575648731493" aria-label="Facebook" className="text-white/50 hover:text-gold transition-colors">
              <Facebook size={24} />
            </a>
            <a href="https://www.instagram.com/glasur.harestua" aria-label="Instagram" className="text-white/50 hover:text-gold transition-colors">
              <Instagram size={24} />
            </a>
          </div>
          <p className="text-white/60 text-sm text-center">
          © 2026 glaSUR Bakeri. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  );
}