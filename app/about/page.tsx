// app/about/page.tsx
import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | RealEstateBD - Building Trust Since 2004",
  description:
    "Learn about RealEstateBD - Bangladesh's trusted real estate partner since 2004. Discover our mission, values, and commitment to quality construction.",
  keywords:
    "about real estate Bangladesh, real estate company Dhaka, property developer Bangladesh",
};

export default function AboutPage() {
  return <AboutClient />;
}
