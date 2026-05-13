import Link from 'next/link';

export const metadata = {
  title: 'Customized Trips - Happy Feet Travellers',
  description: 'Create your perfect tour package with our customization options',
};

export default function CustomizedTripsPage() {
  const packages = [
    {
      id: 1,
      title: 'Romantic Getaway',
      duration: '5N6D',
      price: 'Starting ₹24,999',
      description: 'Perfect for couples looking for a romantic escape with luxury stays and adventure.',
      highlights: ['Luxury Accommodation', 'Couples Activities', 'Adventure Sports', 'Fine Dining'],
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
    },
    {
      id: 2,
      title: 'Family Adventure',
      duration: '4N5D',
      price: 'Starting ₹19,999',
      description: 'Family-friendly packages with kid-focused activities and safe adventures.',
      highlights: ['Kid-Friendly Hotels', 'Wildlife Safari', 'Local Culture', 'Water Activities'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    },
    {
      id: 3,
      title: 'Corporate Team Building',
      duration: '3N4D',
      price: 'Starting ₹14,999',
      description: 'Build stronger teams with our specialized corporate retreat packages.',
      highlights: ['Team Activities', 'Meals & Lodging', 'Flexible Dates', 'Group Discounts'],
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    },
    {
      id: 4,
      title: 'Solo Explorer',
      duration: '7N8D',
      price: 'Starting ₹16,999',
      description: 'Travel solo safely with our experienced guides and social group activities.',
      highlights: ['Budget-Friendly', 'Social Groups', 'Safety Priority', '24/7 Support'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    },
    {
      id: 5,
      title: 'Adventure Junkie',
      duration: '6N7D',
      price: 'Starting ₹22,999',
      description: 'Adrenaline-pumping activities for those seeking thrills and excitement.',
      highlights: ['Trekking', 'Rock Climbing', 'Water Sports', 'Camping'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    },
    {
      id: 6,
      title: 'Spiritual Retreat',
      duration: '5N6D',
      price: 'Starting ₹18,999',
      description: 'Find inner peace with yoga, meditation, and spiritual exploration.',
      highlights: ['Yoga Classes', 'Meditation', 'Ayurveda', 'Wellness'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Customized Trips</h1>
          <p className="text-blue-100">Choose a package and customize it according to your preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              {/* Image */}
              <div className="relative h-40 w-full overflow-hidden bg-gray-300">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.title}</h3>
                <div className="text-sm text-blue-600 font-semibold mb-2">⏱️ {pkg.duration}</div>
                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                {/* Highlights */}
                <div className="mb-4 space-y-1">
                  {pkg.highlights.map((highlight, idx) => (
                    <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {highlight}
                    </div>
                  ))}
                </div>

                {/* Price and Button */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-lg font-bold text-green-600">{pkg.price}</div>
                  <Link
                    href="/contact"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-bold"
                  >
                    Customize
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="text-blue-100 mb-6">Create a completely custom itinerary based on your needs and preferences</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-bold"
          >
            Start Customizing Now
          </Link>
        </div>
      </div>
    </div>
  );
}
