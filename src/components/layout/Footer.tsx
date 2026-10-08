import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl font-bold mb-4">WHITE COAT.</h3>
            <p className="text-white/70 mb-4 text-balance">
              Connect. Learn. Grow.<br />
              A community created for doctors, beyond the clinic.
            </p>
            <p className="text-white/50 text-sm mt-8">
              An initiative by F2Fintech
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/70 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#about" className="text-white/70 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/#events" className="text-white/70 hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/#community" className="text-white/70 hover:text-white transition-colors">Community</Link></li>
              <li><Link href="/#financial-literacy" className="text-white/70 hover:text-white transition-colors">Financial Literacy</Link></li>
              <li><Link href="/#partners" className="text-white/70 hover:text-white transition-colors">Partners</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/doctors" className="text-white/70 hover:text-white transition-colors">Doctor Directory</Link></li>
              <li><Link href="/join" className="text-white/70 hover:text-white transition-colors">Join the Club</Link></li>
              <li><Link href="/contact?type=partner" className="text-white/70 hover:text-white transition-colors">Partner with us</Link></li>
              <li><Link href="/contact?type=speaker" className="text-white/70 hover:text-white transition-colors">Become a speaker</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Contact Us</h4>
            <ul className="space-y-3 text-white/70">
              <li>contact@whitecoatclub.com</li>
              <li>+91 98765 43210</li>
              <li>Mumbai, India</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-white/50 text-sm">
          <p>© 2026 White Coat Club. All Rights Reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
