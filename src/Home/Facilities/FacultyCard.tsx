import { useState } from "react";
import { useGetAllFacultiesQuery } from "../../redux/features/admin/adminApi";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";

interface Faculty {
  _id: string;
  image: string;
  name: string;
  pricePerHour: number;
  location: string;
  description: string;
}

const FacultyCard = () => {
  const { data, isLoading, error } = useGetAllFacultiesQuery(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong. Please try again later.</p>;
  }

  const faculties: Faculty[] = data?.data ?? [];

  // Calculate the displayed faculties based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFaculties = faculties.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(faculties.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentFaculties.map((faculty) => (
          <div
            key={faculty._id}
            className="border rounded-lg overflow-hidden shadow-lg bg-white"
          >
            <img
              src={faculty.image}
              alt={faculty.name}
              className="w-full h-72 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{faculty.name}</h3>
                <span className="text-green-600 font-bold">
                  ${faculty.pricePerHour}/hr
                </span>
              </div>
              <p className="text-sm text-gray-600">{faculty.location}</p>

              <Link to={`/facility/${faculty._id}`}>
                <button className="mt-4 w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition-colors">
                  See details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default FacultyCard;
