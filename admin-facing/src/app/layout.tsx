import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { MainLayout } from "@/components/layout/main-layout";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dental Admin Dashboard",
  description: "Comprehensive admin dashboard for Indian dental practice management",
  keywords: ["dental", "admin", "dashboard", "practice management", "appointments"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          suppressHydrationWarning
        >
          <AuthProvider>
            <ThemeWrapper>
              <MainLayout>
                {children}
              </MainLayout>
              <Toaster richColors position="top-right" />
            </ThemeWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
