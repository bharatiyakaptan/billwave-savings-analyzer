
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "How does BillSmart analyze my electricity bill?",
      answer: "BillSmart uses advanced AI algorithms to analyze your electricity consumption patterns, identify inefficiencies, and suggest optimization strategies tailored to your usage profile."
    },
    {
      question: "What kind of savings can I expect?",
      answer: "Typical savings range from 10-30% of your current electricity bill, depending on your current usage patterns and the recommendations implemented."
    },
    {
      question: "How accurate are the recommendations?",
      answer: "Our recommendations are based on actual usage data from your bills and industry best practices, typically achieving 95% or higher accuracy in savings predictions."
    },
    {
      question: "How long does it take to see results?",
      answer: "Most customers start seeing savings within the first billing cycle after implementing our recommendations, with full benefits realized within 2-3 months."
    }
  ];

  return (
    <section className="py-16 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
