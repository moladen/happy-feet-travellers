import Link from 'next/link';
import CustomizedTripEnquiryForm from '@/components/forms/CustomizedTripEnquiryForm';

export const metadata = {
  title: 'Customized Trip Category - Happy Feet Travellers',
  description: 'Customize your perfect trip',
};

export default async function CustomizedTripCategoryPage({ params }) {
  const { category } = await params;
  const label = decodeURIComponent(String(category)).replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 text-white">
        <div className="container mx-auto px-4">
          <Link href="/customized-trips" className="mb-4 inline-flex items-center gap-2 text-blue-100 hover:text-white">
            ← Back to All Customized Trips
          </Link>
          <h1 className="mb-2 text-4xl font-bold capitalize">Customize Your {label} Experience</h1>
          <p className="text-blue-100">Design the perfect trip tailored to your preferences</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">Customize Your Trip</h2>
          <p className="mb-6 text-gray-600">
            Tell us about your {label} preferences and we&apos;ll create the perfect itinerary for you.
          </p>
          <CustomizedTripEnquiryForm categoryLabel={label} />
        </div>
      </div>
    </div>
  );
}
