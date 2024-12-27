import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function Terms() {
  const terms = [
    "All images and edits are processed on your local device.",
    "We do not store or share your data.",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Terms and Conditions
        </h1>
        <div className="max-w-3xl mx-auto">
          <div className="bg-black/20 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
            <ul className="space-y-4">
              {terms.map((term, index) => (
                <li key={index} className="text-gray-300 leading-relaxed">
                  • {term}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
