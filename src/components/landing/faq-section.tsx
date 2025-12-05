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
      "Yes! We offer a free tier with access to 5 professor profiles, basic search, and limited AI email previews. Upgrade to PRO for unlimited access.",
  },
  {
    question: "Where do professor profiles come from?",
    answer:
      "We collect and verify information from official university websites, Google Scholar, research publications, and other academic sources. All profiles are manually reviewed.",
  },
  {
    question: "How does the AI email generator work?",
    answer:
      "Our AI analyzes the professor's research interests, publications, and background to generate personalized, professional emails. You can customize tone and language.",
  },
  {
    question: "What's included in PRO?",
    answer:
      "PRO members get unlimited profiles, exclusive PRO-only professors, unlimited AI emails, saved templates, export to CSV/PDF, analytics, and priority support.",
  },
  {
    question: "Can professors remove their profiles?",
    answer:
      "Yes. We list publicly available information, but professors can contact us anytime to update, verify, or remove their profiles.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">Everything you need to know</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg border border-gray-200 px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-purple-600 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center p-6 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-2">Still have questions?</p>
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
