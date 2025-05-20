import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Inter } from "next/font/google";
import { Roboto, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { Providers } from "./providers";

import Menu from "@/components/menu";
import AdminNav from "@/components/admin/AdminNav";
import { CupcakeProvider } from "@/context/CupcakeContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { AuthProvider } from "@/context/AuthContext";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});
const montserrat = Montserrat({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(fontSans.variable, inter.className, roboto.variable, montserrat.variable)}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <AuthProvider>
            <CupcakeProvider>
              <CartProvider>
                <OrderProvider>
                  <div className="relative flex flex-col h-screen">
                    <main className="container mx-auto max-w-7xl flex-grow h-[calc(100vh-64px)]">
                      {children}
                    </main>
                    <Menu />
                    <AdminNav />
                  </div>
                  <Toaster position="bottom-center" />
                </OrderProvider>
              </CartProvider>
            </CupcakeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
