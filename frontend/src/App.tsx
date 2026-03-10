// import { ENV } from "./constants"
import { useState, type FormEvent } from "react";

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
  const fields = [
    { id: "name", label: "Name", type: "text" },
    { id: "age", label: "Age", type: "number" },
    { id: "address", label: "Address", type: "text" },
  ];

  const handleInputChange = <K extends keyof InputFieldProps>(
    key: K,
    value: InputFieldProps[K]
  ) => {
    setInputFields(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const [formState, setFormState] = useState<FormState>("default");

  const handleOnAddUser = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("processing");
    alert("Submitted!");
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center">

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
                    className={`
                      border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${formState === "processing"
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "border-gray-300"}
                    `}
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
            className={`
              mt-4 px-6 py-2 rounded text-white font-medium
              ${formState === "processing"
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"}
            `}
          />
        </form>

      </div>

    </div>
  )
}