import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Keio Course Planning Tool
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Smart academic planning for distance learning students
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/calendar"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Calendar
            </Link>
            <Link
              href="/planner"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Course Planner
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              📅
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Calendar</h3>
            <p className="text-gray-600">
              Clean, intuitive interface for viewing your course schedule
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              🎯
            </div>
            <h3 className="text-lg font-semibold mb-2">Graduation Planning</h3>
            <p className="text-gray-600">
              AI-powered course recommendations for optimal graduation paths
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              📊
            </div>
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your progress toward graduation requirements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
