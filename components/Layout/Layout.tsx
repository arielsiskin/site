// components/Layout.tsx
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-custom-gradient text-foreground">
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
