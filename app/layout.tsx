import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kiroween Avatar Maker",
  description: "Create customized ghost avatars for Halloween",
  openGraph: {
    title: "Kiroween Avatar Maker",
    description: "Create customized ghost avatars for Halloween",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiroween Avatar Maker",
    description: "Create customized ghost avatars for Halloween",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
