import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navigation } from "@/components/layout/Navigation";
import { DataLoader } from "@/components/layout/DataLoader";
import { FluentProvider } from "@/components/layout/FluentProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IdAgri - Farmer Identification System",
  description: "Manage farmers, plantations, and employees",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FluentProvider>
          <Providers>
            <DataLoader>
              <Navigation />
              <main className="lg:pl-64 pt-16 lg:pt-0">
                <div className="container mx-auto px-4 py-8">
                  {children}
                </div>
              </main>
            </DataLoader>
          </Providers>
        </FluentProvider>
      </body>
    </html>
  );
}
