import { ChevronDown, HelpCircle } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function ProgramsFAQ() {
  const faqs = [
    {
      question: "How do I know which program is right for me?",
      answer: "We start with a comprehensive consultation where our wellness experts assess your goals, health history, and lifestyle. Based on this assessment, we recommend the most suitable program or combination of programs for your specific needs. You can also book a free consultation to discuss your options."
    },
    {
      question: "Are the programs supervised by medical professionals?",
      answer: "Yes, all our programs are designed and supervised by certified doctors and wellness experts. You'll have regular check-ins with medical professionals who monitor your progress and adjust your plan as needed to ensure optimal results and safety."
    },
    {
      question: "How long do the programs typically last?",
      answer: "Program duration varies based on your goals and the specific program. Our programs range from 12-20 weeks, with most clients seeing significant results within the first 4-6 weeks. We also offer ongoing support and maintenance programs for long-term success."
    },
    {
      question: "What if I can't commit to the full program duration?",
      answer: "We understand that life can be unpredictable. Our programs are designed to be flexible, and we work with you to adjust the timeline based on your circumstances. We also offer shorter intensive programs and can pause your program if needed, with no additional charges."
    },
    {
      question: "Do I need any special equipment or supplies?",
      answer: "Most of our programs require minimal equipment. We provide detailed lists of any needed items, and many can be found at home or purchased inexpensively. For fitness programs, we offer bodyweight alternatives and can work with whatever equipment you have available."
    },
    {
      question: "What kind of support do I get during the program?",
      answer: "You'll have access to 24/7 support through our app, regular check-ins with your wellness coach, and a dedicated support team. You can also join our community of like-minded individuals for additional motivation and support throughout your journey."
    },
    {
      question: "Can I switch programs if my goals change?",
      answer: "Absolutely! We understand that your goals may evolve as you progress. You can switch between programs or add additional programs at any time. Our team will help you transition smoothly and ensure continuity in your wellness journey."
    },
    {
      question: "What happens after I complete my program?",
      answer: "Completing your program is just the beginning! You'll have lifetime access to our resources, ongoing support, and can join our alumni community. We also offer maintenance programs and advanced courses to help you continue your wellness journey and achieve even greater results."
    }
  ];

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
            data-aos="fade-up"
          >
            Frequently Asked{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Questions
            </span>
          </h2>
          <p
            className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Have questions about our programs? We&apos;ve got answers. If you don&apos;t see your question here, 
            feel free to contact us directly.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Collapsible key={index} className="group">
              <div
                className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left transition-colors duration-300 hover:bg-slate-50">
                  <h3
                    className="text-lg font-semibold text-slate-900 group-hover:text-[#35bec5] transition-colors duration-300"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {faq.question}
                  </h3>
                  <ChevronDown className="h-5 w-5 text-slate-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="collapsible-content">
                  <div className="px-6 pb-6">
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
