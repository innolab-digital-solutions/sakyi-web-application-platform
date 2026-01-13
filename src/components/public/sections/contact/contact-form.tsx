"use client";

import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { InputField } from "@/components/shared/forms/input-field";
import { TextareaField } from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { http } from "@/lib/api/client";
import { ContactFormSchema } from "@/lib/validations/public/contact";

export default function ContactForm() {
  const form = useForm(
    {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    {
      validate: ContactFormSchema,
    },
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

      await http.get<void>(ENDPOINTS.AUTH.CSRF_COOKIE, { throwOnError: false });

      form.post(ENDPOINTS.PUBLIC.CONTACT, {
        onSuccess: () => {
          toast.success("Message sent successfully! We'll get back to you within 24 hours.");
          form.reset();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to send message. Please try again.");
        },
      });
  };

  return (
    <section id="contact-form" className="relative overflow-hidden bg-slate-50 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-linear-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-linear-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-linear-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
            <MessageCircle className="h-4 w-4 text-[#35bec5]" />
            <span
              className="text-sm font-medium text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Contact Form
            </span>
          </div>

          <h2
            className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            Send Us a{" "}
            <span
              className="bg-linear-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Message
            </span>
          </h2>

          <p
            className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Have a question or want to learn more about our wellness programs? 
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Centered Contact Form */}
        <div className="mt-16 flex justify-center">
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
              <div className="space-y-8">
                {/* Form Header */}
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-[#35bec5]/10 to-[#0c96c4]/10">
                    <Send className="h-8 w-8 text-[#35bec5]" />
                  </div>
                  <h3
                    className="text-2xl font-bold text-slate-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Get in Touch
                  </h3>
                  <p
                    className="mt-2 text-slate-600"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    We&apos;ll respond within 24 hours
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                <InputField
                      id="name"
                      name="name"
                      type="text"
                      value={String(form.data.name ?? "")}
                      onChange={(event) => form.setData("name", event.target.value)}
                      error={form.errors.name as string}
                      label="Full Name"
                      placeholder="Enter your full name"
                      required
                      disabled={form.processing}
                    />

                  {/* Email and Phone Row */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <InputField
                      id="phone"
                      name="phone"
                      type="text"
                      value={String(form.data.phone ?? "")}
                      onChange={(event) => form.setData("phone", event.target.value)}
                      error={form.errors.phone as string}
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      required
                      disabled={form.processing}
                    />

                    <InputField
                      id="email"
                      name="email"
                      type="email"
                      value={String(form.data.email ?? "")}
                      onChange={(event) => form.setData("email", event.target.value)}
                      error={form.errors.email as string}
                      label="Email Address"
                      placeholder="Enter your email address"
                      required
                      disabled={form.processing}
                    />
                  </div>

                  {/* Subject Field */}
                  <InputField
                    id="subject"
                    name="subject"
                    type="text"
                    value={String(form.data.subject ?? "")}
                    onChange={(event) => form.setData("subject", event.target.value)}
                    error={form.errors.subject as string}
                    label="Subject"
                    placeholder="What can we help you with?"
                    required
                    disabled={form.processing}
                  />

                  {/* Message Field */}
                  <TextareaField
                    id="message"
                    name="message"
                    className="min-h-[160px]"
                    placeholder="Tell us more about your wellness goals and how we can help you achieve them..."
                    value={String(form.data.message ?? "")}
                    onChange={(event) => form.setData("message", event.target.value)}
                    error={form.errors.message as string}
                    label="Message"
                    required
                    disabled={form.processing}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={form.processing}
                    className="group w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer  hover:shadow-xl"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {form.processing ? "Sending..." : "Send Message"}
                    <Send className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
