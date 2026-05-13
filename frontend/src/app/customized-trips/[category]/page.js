import Link from 'next/link';

export const metadata = {
  title: 'Customized Trip Category - Happy Feet Travellers',
  description: 'Customize your perfect trip',
};

export default async function CustomizedTripCategoryPage({ params }) {
  const { category } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/customized-trips" className="text-blue-100 hover:text-white mb-4 inline-flex items-center gap-2">
            ← Back to All Customized Trips
          </Link>
          <h1 className="text-4xl font-bold mb-2">Customize Your {category} Experience</h1>
          <p className="text-blue-100">Design the perfect trip tailored to your preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Customize Your Trip</h2>
          <p className="text-gray-600 mb-6">
            Tell us about your {category} preferences and we&apos;ll create the perfect itinerary for you.
          </p>

          <form className="space-y-6">
            {/* Duration */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">Preferred Duration</label>
              <div className="grid grid-cols-2 gap-4">
                {['3-4 Days', '4-5 Days', '5-6 Days', '7+ Days'].map((duration) => (
                  <label key={duration} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                    <input type="radio" name="duration" value={duration} />
                    <span>{duration}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">Budget Range</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select your budget</option>
                <option>Under ₹10,000</option>
                <option>₹10,000 - ₹20,000</option>
                <option>₹20,000 - ₹50,000</option>
                <option>₹50,000+</option>
              </select>
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">Preferences</label>
              <div className="space-y-2">
                {['Adventure Activities', 'Cultural Sites', 'Relaxation', 'Wildlife', 'Food & Cuisine', 'Photography'].map((pref) => (
                  <label key={pref} className="flex items-center gap-3">
                    <input type="checkbox" />
                    <span>{pref}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Travelers */}
            <div>
              <label htmlFor="travelers" className="block text-lg font-semibold text-gray-800 mb-2">
                Number of Travelers
              </label>
              <input
                type="number"
                id="travelers"
                min="1"
                defaultValue="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Preferred Dates */}
            <div>
              <label htmlFor="dates" className="block text-lg font-semibold text-gray-800 mb-2">
                Preferred Travel Dates
              </label>
              <input
                type="text"
                id="dates"
                placeholder="e.g., June 2026"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/contact"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold text-center block"
              >
                Get Custom Quote
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
