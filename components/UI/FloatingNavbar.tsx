"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative ">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-white hover:opacity-[0.9]"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-white/[0.2] shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-white/[0.2] bg-black shadow-input flex justify-center space-x-4 px-8 py-6"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src?: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2" onClick={() => {
      // Close any open menus when clicking a product item
      const event = new CustomEvent('closeMenu');
      window.dispatchEvent(event);
    }}>
      <div>
        <h4 className="text-xl font-bold mb-1 text-white">
          {title}
        </h4>
        <p className="text-neutral-300 text-sm max-w-[20rem]">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-200 hover:text-white"
    >
      {children}
    </Link>
  );
};

export const FloatingNav = ({
  navItems,
  className,
  logoDropdownContent,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
  logoDropdownContent?: React.ReactNode;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    
    // Add event listener for closing menu
    const handleCloseMenu = () => {
      setIsMenuOpen(false);
      setActiveItem(null);
    };
    
    window.addEventListener('closeMenu', handleCloseMenu);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener('closeMenu', handleCloseMenu);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex w-[95%]  border border-white/[0.8] fixed top-4 inset-x-0 lg:w-[900px] 2xl:w-[1196px] mx-auto rounded-[10px] bg-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-4 py-2 items-center justify-between",
          className
        )}
      >
        <div className="flex-shrink-0 logo-container">
          <Link href={"/"} className="flex-shrink-0">
            <motion.img
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              src="/logo.svg"
              alt="logo mayday"
              className="w-24 h-auto lg:w-40"
            />
          </Link>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-neutral-600"
        >
          <motion.svg
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.svg>
        </button>

        <div className="hidden lg:flex items-center space-x-6 mx-2">
          {navItems.map((navItem: any, idx: number) => (
            <div key={`link-${idx}`} className="relative">
              {navItem.name === "Soluciones" ? (
                <div
                  className="relative"
                  onMouseEnter={() => setActiveItem("soluciones")}
                  onMouseLeave={(e) => {
                    const relatedTarget = e.relatedTarget as HTMLElement;
                    if (!relatedTarget?.closest(".solutions-dropdown")) {
                      setActiveItem(null);
                    }
                  }}
                >
                  <Link
                    href={navItem.link}
                    className="text-sm uppercase font-medium relative text-neutral-50 hover:text-neutral-300"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setActiveItem(null);
                    }}
                  >
                    {navItem.name}
                  </Link>

                  {activeItem === "soluciones" && logoDropdownContent && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={transition}
                      className="absolute w-[400px] top-[calc(100%_+_0.2rem)] left-0 pt-2 solutions-dropdown"
                      onMouseEnter={() => setActiveItem("soluciones")}
                      onMouseLeave={() => setActiveItem(null)}
                    >
                      <motion.div
                        transition={transition}
                        layoutId="active"
                        className="bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-white/[0.2] shadow-xl"
                      >
                        <div onClick={() => setActiveItem(null)}>
                          {logoDropdownContent}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link
                  href={navItem.link}
                  className="text-sm uppercase font-medium relative text-neutral-50 hover:text-neutral-300"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveItem(null);
                  }}
                >
                  {navItem.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-black mt-2 py-2 rounded-lg shadow-lg lg:hidden z-50"
            >
              {navItems.map((navItem: any, idx: number) => (
                <motion.div
                  key={`mobile-link-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={navItem.link}
                    className={cn(
                      "block px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-800"
                    )}
                    onClick={() => {
                      if (navItem.name !== "Soluciones") {
                        setIsMenuOpen(false);
                      }
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {navItem.icon}
                      {navItem.name}
                    </span>
                  </Link>

                  {navItem.name === "Soluciones" && logoDropdownContent && (
                    <div className="px-4 py-2 bg-neutral-900" onClick={() => setIsMenuOpen(false)}>
                      {logoDropdownContent}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
