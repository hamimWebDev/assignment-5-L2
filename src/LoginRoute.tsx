import { useState } from "react";
import LoginModal from "./Login&Rregister/LoginModal";

const LoginRoute = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl font-bold text-red-600">Click hare 👉</h1>
      <button
        onClick={toggleModal}
        type="button"
        className="ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Login now
      </button>
      <LoginModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default LoginRoute;
