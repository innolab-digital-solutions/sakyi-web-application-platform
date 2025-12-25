
import { ChevronDown, HelpCircle } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Dummy FAQs data
const DUMMY_FAQS = [
  {
    question: "What types of wellness programs do you offer?",
    answer:
      "We offer a variety of wellness programs including weight management, stress reduction, chronic disease management, and holistic wellness. Each program is crafted by certified professionals and tailored to your needs."
  },
  {
    question: "How do I know which program is right for me?",
    answer:
      "Our team offers free consultations to help you find the best program based on your personal health goals and lifestyle. Simply contact us to schedule a session."
  },
  {
    question: "Are your programs supervised by healthcare professionals?",
    answer:
      "Yes! All our programs are designed and overseen by qualified doctors and wellness experts to ensure your safety and optimal results."
  },
  {
    question: "Can I join a program online?",
    answer:
      "Absolutely. Most of our programs offer both in-person and virtual participation, making it easy for you to join from anywhere."
  },
  {
    question: "What is the duration of a typical program?",
    answer:
      "Program durations vary. They typically run from 4 to 12 weeks. Specific durations are listed in each program’s details."
  }
];

export default function ProgramsFAQ() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
            <HelpCircle className="h-4 w-4 text-[#35bec5]" />
            <span
              className="text-sm font-medium text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              FAQ
            </span>
          </div>

          <h2
            className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p
            className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Have questions about our programs? We&apos;ve got answers. If you don&apos;t see your question here, feel free to contact us directly.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {DUMMY_FAQS.map((faq, index) => (
            <Collapsible key={index} className="group">
              <div
                className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left transition-colors duration-300 bg-slate-50">
                  <h3
                    className="text-lg font-semibold text-slate-900 group-hover:text-[#35bec5] transition-colors duration-300"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {faq.question}
                  </h3>
                  <ChevronDown className="h-5 w-5 text-slate-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="collapsible-content">
                  <div className="px-6 py-6">
                    <p
                      className="text-slate-600 leading-relaxed"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
}
