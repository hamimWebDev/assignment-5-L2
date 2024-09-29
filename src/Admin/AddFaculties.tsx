import { useState, useRef } from "react";
import { useAddFacultiesMutation } from "../redux/features/admin/adminApi";
import { toast } from "sonner";
import axios from "axios";

const AddFaculties = () => {
  const [addFaculties] = useAddFacultiesMutation();
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string | null>("");
  const [description, setDescription] = useState<string>("");
  const [pricePerHour, setPricePerHour] = useState<string | number>("");
  const [location, setLocation] = useState<string>("");

  const imageInputRef = useRef<HTMLInputElement | null>(null);

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
    const toastId = toast.loading("Adding...");

    let imageUrl = image;

    const fileInput = imageInputRef.current;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      imageUrl = (await handleUploadImg(fileInput.files[0])) as string;
      if (!imageUrl) {
        toast.error("Image upload failed", { id: toastId });
        return;
      }
    }

    try {
      const res = (await addFaculties({
        name,
        image: imageUrl,
        description,
        pricePerHour: Number(pricePerHour),
        location,
      })) as any;

      if (res?.error?.data) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Added successfully", { id: toastId });
        setName("");
        setImage(null);
        setDescription("");
        setPricePerHour("");
        setLocation("");

        // Clear file input after successful submission
        if (fileInput) {
          fileInput.value = "";
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[95%] lg:max-w-md mx-auto bg-slate-200 p-6 rounded-md shadow-md m-5 lg:mt-3"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create Faculty</h2>

        {/* Name Input */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter name"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            required
            ref={imageInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0] as any);
              }
            }}
            className="block mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-600"
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter description"
          />
        </div>

        {/* Price Per Hour Input */}
        <div className="mb-4">
          <label
            htmlFor="pricePerHour"
            className="block text-sm font-medium text-gray-700"
          >
            Price Per Hour
          </label>
          <input
            type="number"
            id="pricePerHour"
            name="pricePerHour"
            required
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter price per hour"
          />
        </div>

        {/* Location Input */}
        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter location"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddFaculties;
