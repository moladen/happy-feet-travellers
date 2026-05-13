import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions - Happy Feet Travellers',
  description: 'Read our terms and conditions',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-blue-100">Last updated: May 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms & Conditions</h2>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">1. Acceptance of Terms</h3>
            <p className="text-gray-700 mb-4">
              By booking a tour with Happy Feet Travellers, you agree to be bound by these terms and conditions. 
              If you do not agree to these terms, please do not book any tours with us.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">2. Booking and Payment</h3>
            <p className="text-gray-700 mb-4">
              All tour bookings must be accompanied by the required deposit or full payment as specified at the time of booking. 
              Acceptance of your booking is confirmed only upon receipt of payment.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">3. Cancellation Policy</h3>
            <p className="text-gray-700 mb-4">
              Please refer to our Cancellation Policy for details regarding cancellations, refunds, and applicable charges.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">4. Liability</h3>
            <p className="text-gray-700 mb-4">
              Happy Feet Travellers is not responsible for any injuries, losses, or damages that may occur during the tour, 
              including but not limited to accidents, theft, or natural disasters. We recommend travel insurance.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">5. Health and Safety</h3>
            <p className="text-gray-700 mb-4">
              Travelers are responsible for ensuring they are fit to participate in the tour activities. 
              We reserve the right to refuse participation to anyone deemed unfit or unable to complete the tour safely.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">6. Conduct</h3>
            <p className="text-gray-700 mb-4">
              All travelers must maintain respectful behavior and comply with local laws and regulations. 
              We reserve the right to remove travelers from the tour for disruptive or illegal behavior without refund.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">7. Itinerary Changes</h3>
            <p className="text-gray-700 mb-4">
              Happy Feet Travellers reserves the right to modify, delay, or cancel tours due to unforeseen circumstances 
              such as weather, natural disasters, or government restrictions. Alternative arrangements will be offered when possible.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">8. Contact Information</h3>
            <p className="text-gray-700 mb-4">
              For any questions regarding these terms, please contact us at info@happyfeet.com or +91 9876543210.
            </p>
          </div>

          {/* Policy Links */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            <Link href="/policies/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">
              Privacy Policy
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
