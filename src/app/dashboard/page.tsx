export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Users Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
              <span className="text-2xl text-white">👥</span>
            </div>
            <div className="ml-5">
              <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
              <p className="mt-1 text-xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>

        {/* Screenshots Today Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
              <span className="text-2xl text-white">📸</span>
            </div>
            <div className="ml-5">
              <h3 className="text-sm font-medium text-gray-500">Screenshots Today</h3>
              <p className="mt-1 text-xl font-semibold text-gray-900">1,248</p>
            </div>
          </div>
        </div>

        {/* Productivity Score Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-yellow-500 p-3">
              <span className="text-2xl text-white">📊</span>
            </div>
            <div className="ml-5">
              <h3 className="text-sm font-medium text-gray-500">Avg. Productivity</h3>
              <p className="mt-1 text-xl font-semibold text-gray-900">87%</p>
            </div>
          </div>
        </div>

        {/* Alerts Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-red-500 p-3">
              <span className="text-2xl text-white">⚠️</span>
            </div>
            <div className="ml-5">
              <h3 className="text-sm font-medium text-gray-500">Active Alerts</h3>
              <p className="mt-1 text-xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 rounded-lg bg-white shadow">
          <div className="p-6">
            <p className="text-sm text-gray-500">Loading activity data...</p>
          </div>
        </div>
      </div>
    </div>
  );
} 