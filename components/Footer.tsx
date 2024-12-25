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
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-gray-400 text-sm">
              Created by{' '}
              <a 
                href="https://x.com/Vineer5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors hover:underline"
              >
                @Vineer
              </a>
            </p>
            <p className="text-gray-400 text-sm">
              UnderlayX AI. © {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
