import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Happy Feet Travellers',
  description: 'Read our privacy policy',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-blue-100">Last updated: May 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy Policy</h2>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">1. Information We Collect</h3>
            <p className="text-gray-700 mb-4">
              We collect personal information including but not limited to: name, email address, phone number, 
              WhatsApp number, and travel preferences when you contact us or book a tour.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">2. How We Use Your Information</h3>
            <p className="text-gray-700 mb-4">
              Your information is used to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Process your booking and provide tour services</li>
              <li>Send you updates and communications about your tour</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our services and website</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">3. Information Sharing</h3>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information to third parties. Your information may be shared with 
              hotel partners, transportation providers, and tour guides solely to provide the tour services you&apos;ve booked.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">4. Data Security</h3>
            <p className="text-gray-700 mb-4">
              We take reasonable measures to protect your personal information from unauthorized access, alteration, 
              disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">5. Cookies</h3>
            <p className="text-gray-700 mb-4">
              Our website may use cookies to enhance user experience. You can control cookies through your browser settings.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">6. Your Rights</h3>
            <p className="text-gray-700 mb-4">
              You have the right to access, update, or delete your personal information. 
              Please contact us at info@happyfeet.com to exercise these rights.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">7. Changes to Privacy Policy</h3>
            <p className="text-gray-700 mb-4">
              We may update this privacy policy from time to time. Changes will be posted on this page 
              with an updated &ldquo;Last updated&rdquo; date.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">8. Contact Us</h3>
            <p className="text-gray-700 mb-4">
              For privacy-related questions, please contact us at info@happyfeet.com or +91 9876543210.
            </p>
          </div>

          {/* Policy Links */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            <Link href="/policies/terms" className="text-blue-600 hover:text-blue-700 font-semibold">
              Terms & Conditions
            </Link>
            <span className="hidden sm:block text-gray-300">|</span>
            <Link href="/policies/cancellation" className="text-blue-600 hover:text-blue-700 font-semibold">
              Cancellation Policy
            </Link>
            <span className="hidden sm:block text-gray-300">|</span>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
