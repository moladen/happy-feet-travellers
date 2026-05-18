import Link from 'next/link';
import CustomizedTripsGrid from '@/components/tour/CustomizedTripsGrid';

export const metadata = {
  title: 'Customized Trips - Happy Feet Travellers',
  description: 'Create your perfect tour package with our customization options',
};

export default function CustomizedTripsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-2 text-4xl font-bold">Customized Trips</h1>
          <p className="text-blue-100">Packages from our CMS — customize any itinerary to your dates and budget</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <CustomizedTripsGrid />

        <div className="mt-12 rounded-lg bg-blue-600 p-8 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="mb-6 text-blue-100">Create a completely custom itinerary based on your needs and preferences</p>
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-white px-8 py-3 font-bold text-blue-600 transition hover:bg-gray-100"
          >
            Start Customizing Now
          </Link>
        </div>
      </div>
    </div>
  );
}
