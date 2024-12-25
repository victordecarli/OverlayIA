import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function FAQ() {
  const faqs = [
    {
      question: "Do I need to create an account to use UnderlayX AI?",
      answer: "No, you can start editing immediately. We don't require any personal information."
    },
    {
      question: "Does UnderlayX AI store my images?",
      answer: "No, everything runs client-side. Your images are never uploaded or stored on our servers."
    },
    {
      question: "Is there a cost to use UnderlayX AI?",
      answer: "UnderlayX AI is free to use, with premium options coming soon."
    },
    {
      question: "Can I download my edited images in high quality?",
      answer: "Yes, you can download your creations in high resolution."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Frequently Asked Questions
        </h1>
        <div className="max-w-3xl mx-auto space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-3">{faq.question}</h2>
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
