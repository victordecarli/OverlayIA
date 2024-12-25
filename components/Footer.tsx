import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-8 bg-black/30 backdrop-blur-sm border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-8">
            <Link 
              href="/faq"
              className="text-gray-400 hover:text-white transition-colors hover:underline"
            >
              FAQ
            </Link>
            <Link 
              href="/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors hover:underline"
            >
              Privacy
            </Link>
            <Link 
              href="/terms-and-conditions"
              className="text-gray-400 hover:text-white transition-colors hover:underline"
            >
              Terms
            </Link>
          </div>
          <p className="text-gray-400 text-sm text-center md:text-right">
            UnderlayX AI. © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
