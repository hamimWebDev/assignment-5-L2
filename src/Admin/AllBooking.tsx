import { Link } from "react-router-dom";
import { useGetAllBookingsQuery } from "../redux/features/admin/adminApi";
import { useState } from "react";

const AllBooking = () => {
  const { data: bookingData, isLoading } = useGetAllBookingsQuery(undefined);

  const [searchQuery, setSearchQuery] = useState("");
  const [facilityQuery, setFacilityQuery] = useState(""); // New state for facility name selection

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  // Get unique facility names
  const uniqueFacilities = Array.from(
    new Set(bookingData?.data.map((booking: any) => booking?.facility?.name))
  );

  // Filter bookings based on date (searchQuery) and facility name (facilityQuery)
  const filteredBookings = bookingData?.data.filter((booking: any) => {
    const matchesDate = booking.date.includes(searchQuery);
    const matchesFacility =
      facilityQuery === "" || booking?.facility?.name === facilityQuery;
    return matchesDate && matchesFacility;
  });

  return (
    <div className="overflow-x-auto lg:ml-64">
      {/* Search Inputs */}
      <div className="flex justify-end p-4 space-x-4">
        {/* Search by Date */}
        <input
          type="date"
          placeholder="Search by date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-md px-4 py-2"
        />

        {/* Select Facility Name */}
        <select
          value={facilityQuery}
          onChange={(e) => setFacilityQuery(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          <option value="">Select facility</option>
          {uniqueFacilities.map((facility, index) => (
            <option key={index} value={facility as any}>
              {facility as any}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Facility name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredBookings?.map((booking: any, index: number) => (
            <tr key={booking._id}>
              <td className="flex items-center px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {index + 1}
                <img
                  src="https://cdn-icons-png.freepik.com/256/3526/3526454.png?semt=ais_hybrid"
                  alt="bookMark"
                  className="ml-4 h-8"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking?.date || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking?.startTime || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking?.endTime || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking?.facility?.name || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking?.user?.name || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking?.user?.phone || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking?.user?.address || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                {/* View Details */}
                <Link to={`/admin/booking/${booking?._id}`}>
                  <button className="text-purple-600 border border-purple-700 p-1 rounded-sm hover:text-white hover:bg-purple-500">
                    View details
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllBooking;
