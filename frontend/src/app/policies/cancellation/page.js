import Link from 'next/link';

export const metadata = {
  title: 'Cancellation Policy - Happy Feet Travellers',
  description: 'Read our cancellation and refund policy',
};

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Cancellation Policy</h1>
          <p className="text-blue-100">Last updated: May 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cancellation & Refund Policy</h2>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Cancellation Timeline and Charges</h3>
            <p className="text-gray-700 mb-4">
              The following cancellation charges apply based on the date of cancellation before the tour departure:
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-gray-700">
                <thead>
                  <tr className="bg-blue-50 border-b border-gray-300">
                    <th className="px-4 py-2 text-left font-bold">Cancellation Time</th>
                    <th className="px-4 py-2 text-left font-bold">Cancellation Charges</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2">More than 45 days before departure</td>
                    <td className="px-4 py-2">10% of total booking amount</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2">30-45 days before departure</td>
                    <td className="px-4 py-2">25% of total booking amount</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2">15-30 days before departure</td>
                    <td className="px-4 py-2">50% of total booking amount</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Less than 15 days before departure</td>
                    <td className="px-4 py-2">100% of total booking amount (No refund)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">How to Cancel</h3>
            <p className="text-gray-700 mb-4">
              To cancel your tour booking:
            </p>
            <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
              <li>Contact us via WhatsApp, email, or phone</li>
              <li>Provide your booking reference number</li>
              <li>State the reason for cancellation (optional)</li>
              <li>We will process your cancellation within 5 business days</li>
            </ol>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Refund Process</h3>
            <p className="text-gray-700 mb-4">
              After cancellation, refunds will be processed within 7-10 business days to your original payment method. 
              Bank transaction fees, if any, will be borne by the customer.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">No-Show Policy</h3>
            <p className="text-gray-700 mb-4">
              If you fail to show up for the tour without prior cancellation, the full booking amount will be forfeited with no refund.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Tour Postponement</h3>
            <p className="text-gray-700 mb-4">
              In case of unforeseen circumstances such as weather, natural disasters, or government restrictions, 
              we reserve the right to postpone or cancel the tour. In such cases:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Alternate tour dates will be offered</li>
              <li>Or full refund will be provided if no alternative dates are acceptable</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Travel Insurance</h3>
            <p className="text-gray-700 mb-4">
              We strongly recommend purchasing travel insurance to cover unforeseen events. 
              Travel insurance is not included in the tour package and must be purchased separately.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Contact for Cancellation</h3>
            <p className="text-gray-700 mb-4">
              For cancellations, please contact us at:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Email: info@happyfeet.com</li>
              <li>Phone: +91 9876543210</li>
              <li>WhatsApp: <a href="https://wa.me/919876543210" className="text-blue-600 hover:text-blue-700">Chat Now</a></li>
            </ul>
          </div>

          {/* Policy Links */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            <Link href="/policies/terms" className="text-blue-600 hover:text-blue-700 font-semibold">
              Terms & Conditions
            </Link>
            <span className="hidden sm:block text-gray-300">|</span>
            <Link href="/policies/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">
              Privacy Policy
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
