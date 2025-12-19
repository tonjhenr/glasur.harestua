import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <h3 className="text-white">Følg oss på sosiale medier</h3>
          <div className="flex items-center gap-8">
            <a
              href="https://www.facebook.com/glasur.harestua"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Besøk oss på Facebook"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary text-2xl font-bold">f</span>
              </div>
            </a>
            <a
              href="https://www.instagram.com/glasur.harestua"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Følg oss på Instagram"
            >
              <Instagram className="h-10 w-10" />
            </a>
          </div>
          <p className="text-white text-center">
            © 2026 Glasur.Harestua
          </p>
        </div>
      </div>
    </footer>
  );
}