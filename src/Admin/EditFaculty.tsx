import React, { useState, useEffect } from "react";
import {
  useGetAFacultyQuery,
  useUpdateFacultyMutation,
} from "../redux/features/admin/adminApi";
import { toast } from "sonner";
import axios from "axios";

interface EditAFacultyModalProps {
  id: string;
  isEditAFacultyModalOpen: boolean;
  setIsEditAFacultyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditAFacultyModal: React.FC<EditAFacultyModalProps> = ({
  id,
  isEditAFacultyModalOpen,
  setIsEditAFacultyModalOpen,
}) => {
  // Fetch faculty data
  const { data: facultyData } = useGetAFacultyQuery(id);

  // State for form inputs
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerHour, setPricePerHour] = useState<number | string>(""); 
  const [location, setLocation] = useState("");

  // Set state when faculty data is fetched
  useEffect(() => {
    if (facultyData?.data) {
      const { name, image, description, pricePerHour, location } =
        facultyData.data;
      setName(name);
      setDescription(description);
      setPricePerHour(pricePerHour);
      setLocation(location);
      setImage(image);
    }
  }, [facultyData]);

  const closeModal = () => setIsEditAFacultyModalOpen(false);

  const [editFaculty, { isLoading }] = useUpdateFacultyMutation();

  const handleUploadImg = async (file: File): Promise<string | null> => {
    const imageBBApiKey = "3ab9a41a4be5e04b88403d171ce271e6";

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imageBBApiKey}`,
          formData
        );
        return response.data.data.url;
      } catch (error) {
        console.error("Error uploading image", error);
        toast.error("Image upload failed");
        return null;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Editing...");

    let imageUrl = image;

    const fileInput = (e.target as HTMLFormElement).image;
    if (fileInput && fileInput.files[0]) {
      imageUrl = (await handleUploadImg(fileInput.files[0])) as string;
      if (!imageUrl) {
        toast.error("Image upload failed", { id: toastId });
        return;
      }
    }

    try {
      const res = (await editFaculty({
        facultyId: id,
        facultyData: {
          name,
          image: imageUrl,
          description,
          pricePerHour,
          location,
        },
      })) as any;

      if (res?.error?.data) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Edit successfully", { id: toastId });
        closeModal();
      }
    } catch (err) {
      console.error(err); // Log error details for debugging
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <>
      {isEditAFacultyModalOpen && (
        <div
          id="edit-faculty-modal"
          tabIndex={-1}
          aria-hidden={!isEditAFacultyModalOpen}
          className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <img
                  className="h-14"
                  src="https://dreamsport.com/images/main-logo.png"
                  alt="logo"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Faculty
                </h3>
                <button
                  type="button"
                  aria-label="Close modal"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={closeModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 md:p-5">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Faculty Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Updated Faculty Name"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Upload Image
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={(e) => setImage(e.target.value)}
                      className="block mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-600"
                      placeholder="Upload image"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Updated description for the faculty."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="pricePerHour"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price Per Hour
                    </label>
                    <input
                      type="number"
                      name="pricePerHour"
                      id="pricePerHour"
                      value={pricePerHour}
                      onChange={(e) => setPricePerHour(Number(e.target.value))}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="40"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="123 University Ave, City"
                    />
                  </div>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className={`w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? "Saving changes..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditAFacultyModal;
