import "./globals.css";
import { FirebaseProvider } from "./lib/firebase";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "VERSA | Where Gamers Compete & Earn Esports Coins",
  description: "VERSA is a futuristic, premium gaming wager platform. Participate in coin matches, create elite unions, stream live play, and simulate Stripe withdrawals.",
  keywords: "esports, wagers, gaming tournament, playstation, coin rewards, esports guild"
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider>
          <Navbar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
            {children}
          </main>
          <Footer />
        </FirebaseProvider>
      </body>
    </html>
  );
}
