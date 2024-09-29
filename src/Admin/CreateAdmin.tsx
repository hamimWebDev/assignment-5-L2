import React, { useState } from "react";
import { setUser } from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";
import { toast } from "sonner";
import { useAddUserMutation } from "../redux/features/auth/authApi";
import { useAppDispatch } from "../redux/features/hooks";

interface CreateAdminOrUserModalProps {
  isCreateAdminOrUserModalOpen: boolean;
  setIsCreateAdminOrUserModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const CreateAdminOrUserModal: React.FC<CreateAdminOrUserModalProps> = ({
  isCreateAdminOrUserModalOpen,
  setIsCreateAdminOrUserModalOpen,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("Programming Hero");
  const [email, setEmail] = useState("web@programming-hero1.com");
  const [role, setRole] = useState(""); // Role state
  const [password, setPassword] = useState("programming-hero");
  const [phone, setPhone] = useState("01749770101");
  const [address, setAddress] = useState(
    "Level-4, 34, Awal Centre, Banani, Dhaka"
  );

  const closeModal = () => setIsCreateAdminOrUserModalOpen(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const [addUser, { isLoading }] = useAddUserMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Creating account...");
    try {
      const res = (await addUser({
        name,
        email,
        role, // Include role in the payload
        password,
        phone,
        address,
      })) as any;

      if (res?.error?.data) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Account created successfully", { id: toastId });
        const user = verifyToken(res?.data?.token);
        dispatch(setUser({ user, token: res?.data?.token }));

        if (res?.data?.token) {
          setName("");
          setEmail("");
          setRole(""); // Reset role
          setPassword("");
          setPhone("");
          setAddress("");
          closeModal();
        }
      }
    } catch (err) {
      console.error(err); // Log error details for debugging
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {isCreateAdminOrUserModalOpen && (
        <div
          id="authentication-modal"
          tabIndex={-1}
          aria-hidden={!isCreateAdminOrUserModalOpen}
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
                  Register
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
                      Your name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="example@gmail.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="role"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Select Role
                    </label>
                    <select
                      name="role"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    >
                      <option value="" disabled>
                        Choose a role
                      </option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 dark:text-gray-300 mt-[30px]"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                          width="24"
                          height="24"
                          fill="currentColor"
                        >
                          <path d="M320 96C211.2 96 113.4 150.3 48.5 239.8C39.3 252.8 39.3 259.2 48.5 272.2C113.4 361.7 211.2 416 320 416C428.8 416 526.6 361.7 591.5 272.2C600.7 259.2 600.7 252.8 591.5 239.8C526.6 150.3 428.8 96 320 96zM320 128C383.3 128 442.5 161.2 485.5 214.8C451.9 254.9 409.7 288.5 365.3 312.1C368.9 300.2 370.7 287.4 370.7 273.7C370.7 218.6 326.3 173.3 271.2 173.3C256.5 173.3 241.8 175.6 228.2 179.9C252.7 153.9 284.8 135.6 320 128zM94.6 273.7C119.3 300.4 150.1 321.8 184.7 336.3C194.6 305.1 220.4 281.8 252.1 275.4C252.2 277.4 252.3 279.3 252.3 281.3C252.3 337.4 296.7 382.7 351.8 382.7C366.7 382.7 380.8 380.1 393.4 375.4C368.2 401.3 336.2 419.6 301 427.6C257.5 442.3 207.4 438.8 157.4 414.4C118.7 396.5 88.9 369.4 69.3 336.2C68.4 334.6 67.6 333 66.8 331.3C77.4 307.4 87.9 283.7 94.6 273.7zM271.2 208C294.1 208 313.4 227.2 313.4 250.1C313.4 273 294.1 292.2 271.2 292.2C248.3 292.2 229 273 229 250.1C229 227.2 248.3 208 271.2 208z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+123456789"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Register"}
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

export default CreateAdminOrUserModal;
