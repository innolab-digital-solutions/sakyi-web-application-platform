
import { ChevronDown, HelpCircle } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Dummy FAQs data
const DUMMY_FAQS = [
  {
    question: "Program ကာလအတွင်းမှာ စားရမှာတွေ limit လုပ်ပီး အဲအတိုင်းစားရမှာလား",
    answer:
      "မဟုတ်ပါဘူး Sa Kyi Health & Wellness က တစ်ယောက်ချင်းဆီရဲ့ Lifestyle ပေါ်မူတည်ပီး ဆရာက စားတဲ့ pattern ကိုဖြည်းဖြည်းချင်းပြောင်းလဲပေးသွားမှာမလို့ မလိုပါဘူး"
  },
  {
    question: "Gym သွားရမှာလား ",
    answer:
      "အကယ်လို့ သင်က gym သွားနေကြသူမဟုတ်ရင် သွားစရာမလိုပါဘူး အိမ်မှာဘဲ လုပ်နိုင်ဖို့အတွက် ကို Home Workout တွေ ပေးမှာ ဖြစ်ပါတယ်"
  },
  {
    question: "Program က ဘာလုပ်ပေးမှာလဲ Gym Instruction ပေးမှာလား Diet ပေးမှာလား",
    answer:
      "Sa Kyi Health & Wellness Program တွေက မိမိ lifestyle ကိုပြောင်းဖို့အတွက် စနစ်တကျ ဖွဲံစည်းပေးထားတဲ့ team တွေရှိတဲ့အပြင် မိမိနဲ့အပတ်စဉ် ဆွေးနွေးသွားမယ့်  Technical Doctor က အပတ်စဉ် စားရမယ့် Pattern လေ့ကျင့်ခန်း Sleep Pattern အစရှိတာတွေပါ instruction ပေးသွားမှာ ဖြစ်ပါတယ်။"
  },
  {
    question: "Which program should I join?",
    answer:
      "Before starting any program, you will need to consult with a Technical Doctor to find the program that best fits you. You can then join the program recommended by the doctor. "
  },
  {
    question: "Program Join ဖို့ဘာတွေလိုအပ်လဲ",
    answer:
      "Program join ဖို့အတွက် တစ်ပတ်တာ doctor နဲ့ဆွေးနွေးဖို့ အချိန် ၁နာရီခွဲ 2025 နောက်ပိုင်း Smart Watch တစ်ခုရယ် Program မစခင် inbody စစ်ဆေးပေးရန် လိုအပ်ပါတယ်။"
  },
   {
    question: "အရမ်းအလုပ်များတော့ တစ်ရက်တာမှာ လေ့ကျင့်ခန်းတွေသေချာလုပ်ဖို့အတွက် အချိန်မရဘူးဖြစ်နေတာ join လို့ရလား",
    answer:
      "Sa Kyi Health & Wellness မှာ ရှိတဲ့ program တွေက မိမိ ရှိပီးသား lifestyle ကို ပြောင်းလဲပေးပီး သေချာ ထိန်းညှိပေးသွားတဲ့ Program တွေမလို့ မိမိအနေနဲ့ စိတ်ပူစရာ မလိုပါဘူး"
  },
   {
    question: "How long do I need to join the program? Do I have to join continuously?",
    answer:
      "Each individual program lasts for a maximum of three months, so you can stop once you have completed one program. However, if you have not yet reached your desired results and wish to continue, you can consult with a technical doctor to select and join subsequent programs."
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
