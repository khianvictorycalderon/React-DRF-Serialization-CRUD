import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  name: string;
  age: number;
  address: string;
}

interface InputFieldProps {
  name: string;
  age: number;
  address: string;
}

const INPUT_FIELDS_DEFAULT_VALUES: InputFieldProps = {
  name: "",
  age: 0,
  address: ""
}

type FormState = "default" | "processing" | "success" | "error";

export default function App() {

  const [inputFields, setInputFields] = useState<InputFieldProps>(INPUT_FIELDS_DEFAULT_VALUES);
  const [formState, setFormState] = useState<FormState>("default");
  const fields = [
    { id: "name", label: "Name", type: "text" },
    { id: "age", label: "Age", type: "number" },
    { id: "address", label: "Address", type: "text" },
  ];

  // -------------------- MISC FUNCTIONS --------------------------------
  const handleInputChange = <K extends keyof InputFieldProps>(
    key: K,
    value: InputFieldProps[K]
  ) => {
    setInputFields(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCopyID = (id: string) => {
    navigator.clipboard.writeText(id)
      .then(() => alert("ID copied to clipboard!"))
      .catch(err => console.error("Failed to copy ID:", err));
  };
  // -----------------------------------------------------------------

  // -------------------- READ USER --------------------------------
  const [fetchID, setFetchID] = useState("");
  const [fetchedUser, setFetchedUser] = useState<User | null>(null);

  // Fetch single user by ID
  const handleFetchUser = async () => {
    if (!fetchID) {
      alert("Please enter a user ID!");
      return;
    }
    try {
      const res = await axios.get<User>(`${API_URL}/api/user/${fetchID}/`);
      setFetchedUser(res.data);
    } catch (e) {
      console.error("Failed to fetch user:", e);
      alert("User not found or failed to fetch.");
      setFetchedUser(null);
    }
  };
  // -----------------------------------------------------------------

  // -------------------- READ ALL USERS --------------------------------
  const [users, setUsers] = useState<User[]>([]);
  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(`${API_URL}/api/user/`);
      setUsers(res.data);
    } catch (e) {
      console.error("Failed to fetch users:", e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  // -----------------------------------------------------------------

  // -------------------- CREATE USER --------------------------------
  const handleOnAddUser = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("processing");

    try {
      // Tries to add user using DJango REST Framework
      await axios.post(`${API_URL}/api/user/`, {
        name: inputFields.name,
        age: inputFields.age,
        address: inputFields.address
      });

      await fetchUsers();

      // UI
      setFormState("success");

      // Clears the input
      setInputFields(INPUT_FIELDS_DEFAULT_VALUES);
    } catch (e: unknown) {
      alert("Failed to add new user!");
      console.error(`Error adding new user: ${e instanceof Error ? e.message : String(e)}`);
      setFormState("error");
    } 
  }
  // -----------------------------------------------------------------

  return (
    <div className="min-h-screen w-full flex justify-center items-center py-16">

      <div className="text-center">
        
        <h2 className="text-2xl font-bold">Add User: </h2>
        <form onSubmit={handleOnAddUser}>
          <div className="flex flex-row gap-4 w-full">
            {fields.map(({ id, label, type }) => {
              const fieldValue = inputFields[id as keyof InputFieldProps];
              const value =
                type === "number"
                  ? typeof fieldValue === "number" && !isNaN(fieldValue)
                    ? fieldValue
                    : ""
                  : fieldValue ?? "";

              return (
                <div key={id} className="flex flex-col">
                  <label htmlFor={id} className="mb-1 font-medium text-gray-700">
                    {label}:
                  </label>
                  <input
                    disabled={formState === "processing"}
                    id={id}
                    type={type}
                    className="
                      border border-gray-300 rounded px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed
                    "
                    required
                    value={value}
                    onChange={(e) =>
                      handleInputChange(
                        id as keyof InputFieldProps,
                        type === "number" ? e.currentTarget.valueAsNumber : e.currentTarget.value
                      )
                    }
                  />
                </div>
              );
            })}
          </div>

          <input
            disabled={formState === "processing"}
            type="submit"
            value="Add"
            className="
              mt-4 px-6 py-2 rounded text-white font-medium
              bg-green-600 hover:bg-green-700 cursor-pointer
              disabled:bg-green-400 disabled:cursor-not-allowed
            "
          />
        </form>

        {/* Single User Fetch Section */}
        <div className="flex-1 max-w-2xl mt-8">
          <h2 className="text-2xl font-bold mb-2">Fetch User by ID</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter user ID"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              value={fetchID}
              onChange={(e) => setFetchID(e.currentTarget.value)}
            />
            <button
              onClick={handleFetchUser}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer
                        disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              Fetch User
            </button>
          </div>

          {fetchedUser && (
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Age</th>
                  <th className="px-4 py-2 text-left">Address</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200 hover:bg-neutral-200">
                  <td className="px-4 py-2 break-all">{fetchedUser.id}</td>
                  <td className="px-4 py-2">{fetchedUser.name}</td>
                  <td className="px-4 py-2">{fetchedUser.age}</td>
                  <td className="px-4 py-2">{fetchedUser.address}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Users Table */}
        <div className="flex-1 max-w-2xl mt-8">
          <h2 className="text-2xl font-bold mb-4">All Users</h2>
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Age</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t border-gray-200 hover:bg-neutral-200">
                  <td className="px-4 py-2 break-all">{user.id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.age}</td>
                  <td className="px-4 py-2">{user.address}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleCopyID(user.id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer 
                              disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      Copy ID
                    </button>
                    <button
                      disabled={false}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer
                                disabled:bg-yellow-300 disabled:text-gray-200 disabled:cursor-not-allowed"
                    >
                      Edit
                    </button>
                    <button
                      disabled={false}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer
                                disabled:bg-red-400 disabled:text-gray-200 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}