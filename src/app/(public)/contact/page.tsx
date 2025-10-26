import React from "react";

import ContactCTA from "@/components/public/sections/contact/contact-cta";
import ContactDetails from "@/components/public/sections/contact/contact-details";
import ContactForm from "@/components/public/sections/contact/contact-form";
import ContactHero from "@/components/public/sections/contact/contact-hero";

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <ContactDetails />

      <ContactForm />

      <ContactCTA />
    </>
  );
}
