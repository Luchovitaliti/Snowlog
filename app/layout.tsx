import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnowLog · Las Leñas",
  description:
    "Registro de clases para instructores de snowboard en Las Leñas: cargá tus clases y calculá cuánto cobrar.",
  applicationName: "SnowLog",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SnowLog",
  },
};

export const viewport: Viewport = {
  themeColor: "#060B12",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex flex-col">{children}</body>
    </html>
  );
}
