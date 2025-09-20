import CalendarView from "@/components/calendar/CalendarView";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Calendar</h1>
          <p className="mt-2 text-gray-600">
            View your enrolled courses and manage your schedule
          </p>
        </div>
        <div className="h-[calc(100vh-200px)]">
          <CalendarView />
        </div>
      </div>
    </div>
  );
}
