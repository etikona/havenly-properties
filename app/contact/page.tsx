// app/contact/page.tsx
import { Metadata } from "next";
import ContactClient from "./ContactClient";
// import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: "Contact Us | RealEstateBD",
  description:
    "Get in touch with RealEstateBD. Our team is ready to assist you with property inquiries, investments, and real estate consultations.",
  keywords:
    "contact real estate Bangladesh, property consultation, real estate agent Dhaka",
};

export default function ContactPage() {
  return <ContactClient />;
}
