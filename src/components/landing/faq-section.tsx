"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is this platform free to use?",
    answer:
      "Yes! We offer a free tier that includes access to 5 professor profiles, basic search, and limited AI email previews. You can upgrade to PRO for unlimited access and advanced features.",
  },
  {
    question: "Where do the professor profiles come from?",
    answer:
      "We collect and verify professor information from official university websites, Google Scholar, research publications, and other academic sources. All profiles are manually reviewed for accuracy.",
  },
  {
    question: "How does the AI email generator work?",
    answer:
      "Our AI analyzes the professor's research interests, recent publications, and background to generate personalized, professional outreach emails. You can customize the tone, language (English or Vietnamese), and purpose of your message.",
  },
  {
    question: "What's included in the PRO subscription?",
    answer:
      "PRO members get unlimited professor profiles, access to exclusive PRO-only professors, unlimited AI email generation, saved templates, export to CSV/PDF, response tracking analytics, and priority support.",
  },
  {
    question: "Can I try PRO features before paying?",
    answer:
      "Currently, PRO features are coming soon. We recommend starting with the free tier to explore the platform. We'll announce PRO pricing and trial options when available.",
  },
  {
    question: "Do professors know they're listed here?",
    answer:
      "We list publicly available information from academic sources. Professors can contact us to update, verify, or remove their profiles at any time.",
  },
  {
    question: "Can I suggest a professor to add?",
    answer:
      "Absolutely! We welcome suggestions. Please contact us with the professor's name, university, and any relevant links, and we'll review it for inclusion.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about the platform
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg border px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-purple-600">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="mailto:support@vietnameseprofessors.com"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </section>
  );
}
