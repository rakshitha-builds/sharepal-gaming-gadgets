import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Overlays from "@/components/Overlays";
export const metadata: Metadata = {
  title: "Rent gaming gadgets in Bangalore | Zero Deposit Rentals | SharePal",
  description: "Rent PS5, Xbox, VR and racing wheels in Bangalore. Zero deposit, free delivery, pay on delivery.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><StoreProvider>{children}<Overlays /></StoreProvider></body></html>);
}
