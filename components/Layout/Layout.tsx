// components/Layout.tsx
import { ReactNode } from "react";
import { FloatingNav, ProductItem } from "@/components/UI/FloatingNavbar";
import Footer from "@/components/Footer/Footer";
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navItems = [
    { name: "Clientes", link: "/#clientes" },
    { name: "Soluciones", link: "/#soluciones" },
    { name: "Nosotros", link: "/about-us" },
    { name: "Contacto", link: "/#contacto" },
  ];

  const solutionsDropdown = (
    <div className="grid grid-cols-1 gap-4 p-4">
      <ProductItem
        title="OMNICHANNEL SOLUTION"
        description="Solución All-in-One"
        href="/omni-channel"
        src="/solutions/omnichannel.jpg"
      />
      <ProductItem
        title="IA BOT"
        description="Atención al cliente con bots inteligentes"
        href="/ia-bot"
        src="/solutions/ia-bot.jpg"
      />
      <ProductItem
        title="VOICEBOT"
        description="Experiencia Humana + Agentes IA"
        href="/voicebot"
        src="/solutions/voicebot.jpg"
      />
      <ProductItem
        title="SYNERGY WFM"
        description="Asignación de recursos y productividad"
        href="/synergy-wfm"
        src="/solutions/synergy.jpg"
      />
    </div>
  );

  return (
    <>
      <FloatingNav
        navItems={navItems}
        logoDropdownContent={solutionsDropdown}
      />
      <div className="min-h-screen bg-custom-gradient text-foreground">
        <main className="w-full mx-auto px-4 py-6">
          {children}
          <Footer />
        </main>
      </div>
    </>
  );
};

export default Layout;
