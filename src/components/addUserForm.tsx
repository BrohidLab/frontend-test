"use client";

import { useState, useEffect } from "react";

interface AddUserFormProps {
    initialData?: {
        id?: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    onSave: (form: any) => void;
}

export default function AddUserForm({ initialData, onSave }: AddUserFormProps) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                firstName: initialData.firstName || "",
                lastName: initialData.lastName || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleValidateAndSave = async () => {
        setMessage("Validating...");
        setLoading(true);

        try {
            let valid = true;

            if (form.email) {
                const res = await fetch(
                    `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.EMAIL_VALIDATION_KEY}&email=${form.email}`
                );
                const data = await res.json();
                valid = data.deliverability === "DELIVERABLE";
                if (!valid) setMessage("Invalid Email!");
            } else if (form.phone) {
                const res = await fetch(
                    `https://phonevalidation.abstractapi.com/v1/?api_key=${process.env.PHONE_VALIDATION_KEY}&phone=${form.phone}`
                );
                const data = await res.json();
                valid = data.valid;
                if (!valid) setMessage("Invalid Phone!");
            }

            if (valid) {
                setMessage("Valid! User saved.");
                onSave(form);
                if (!initialData) {
                    setForm({ firstName: "", lastName: "", email: "", phone: "" });
                }
            }
        } catch (err) {
            console.error(err);
            setMessage("Validation failed.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
            <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 rounded col-span-2 focus:ring-2 focus:ring-blue-500"
            />
            <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 rounded col-span-2 focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <button
            onClick={handleValidateAndSave}
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
                loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
            {loading
                ? "Processing..."
                : initialData
                ? "💾 Save Changes"
                : "✅ Validate & Add"}
        </button>

        {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}
