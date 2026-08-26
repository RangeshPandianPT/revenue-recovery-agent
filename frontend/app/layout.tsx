import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecoverAI - Autonomous Revenue Recovery",
  description: "Find revenue at risk. Choose the right intervention. Recover it with bounded AI workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex overflow-hidden text-gray-900 bg-gray-50 selection:bg-blue-200`}
      >
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
          </main>
        </div>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#fff',
              color: '#333',
              border: '1px solid #eaeaea'
            }
          }}
        />
      </body>
    </html>
  );
}
