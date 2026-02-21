import { Music } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t bg-card mt-auto">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <Link to="/" className="flex items-center gap-2">
          <Music className="h-5 w-5 text-accent" />
          <span className="font-display text-lg font-bold">Harmony</span>
        </Link>
        <p className="text-sm text-muted-foreground">
          © 2026 Harmony Music Store. Student Project — No real transactions.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
