import { useState } from "react";
import {
  useCancelBookingMutation,
  useGetUserBookingsQuery,
} from "../redux/features/user/userApi";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Extend dayjs with the customParseFormat plugin
dayjs.extend(customParseFormat);

const UserBooking = () => {
  const { data: bookingData, isLoading } = useGetUserBookingsQuery(undefined);
  const [cancelBooking] = useCancelBookingMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [facilityQuery, setFacilityQuery] = useState("");

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const formatTime = (time: string) => {
    return dayjs(time, "HH:mm").isValid()
      ? dayjs(time, "HH:mm").format("hh:mm A")
      : "Invalid Time"; // Ensure it's valid before formatting
  };

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

  // Handle cancellation confirmation modal
  const handleDelete = (userId: string) => {
    setBookingToCancel(userId);
    setShowCancelConfirm(true);
  };

  const confirmCancelBooking = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel);
      setShowCancelConfirm(false); // Close the modal after canceling
    }
  };

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
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-4">
                No Booking Now
              </td>
            </tr>
          ) : (
            filteredBookings?.map((booking: any, index: number) => (
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
                  {formatTime(booking?.startTime) || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatTime(booking?.endTime) || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking?.facility?.name || "N/A"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                  {/* View Details */}
                  <Link to={`/user/booking/${booking?._id}`}>
                    <button className="text-purple-600 border border-purple-700 p-1 rounded-sm hover:text-white hover:bg-purple-500">
                      View details
                    </button>
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(booking?._id)}
                    className="text-red-600 border border-red-700 p-1 rounded-sm hover:text-white hover:bg-red-500"
                  >
                    Cancel booking
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
            <div className="flex justify-center mb-6">
              <button className="text-6xl border-2 border-red-700 text-red-600 rounded-full p-6">
                ❗
              </button>
            </div>
            <div className="text-center">
              <h2 className="text-3xl text-gray-800 font-bold mb-4">
                Are you sure?
              </h2>
              <p className="text-gray-600 text-lg sm:text-xl">
                Do you want to cancel this booking? This action cannot be
                undone.
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={confirmCancelBooking}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md transition duration-300"
                >
                  Yes, cancel it!
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition duration-300"
                >
                  No, keep it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBooking;
