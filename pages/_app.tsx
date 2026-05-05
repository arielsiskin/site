import Layout from "@/components/Layout/Layout";
import "@/styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG } from "../emailjs";

export default function App({ Component, pageProps }: AppProps) {
  // Initialize EmailJS when the app starts
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
