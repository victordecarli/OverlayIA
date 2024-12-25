import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Privacy Policy
        </h1>
        <div className="max-w-3xl mx-auto prose prose-invert">
          <div className="bg-black/20 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
            <p className="text-gray-300 leading-relaxed">
              We value your privacy. UnderlayX AI operates entirely on the client side, ensuring that your data and images stay private. We do not collect or store any personal data. The app uses Google Analytics for general usage tracking, which helps us improve your experience. No data is shared with third parties.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
