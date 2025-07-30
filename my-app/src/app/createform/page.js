"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaUserPlus, FaTimes } from "react-icons/fa";

function Createform() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editId, setEditId] = useState(null);
  const [users, setUsers] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getallusers`);
      setUsers(res.data.user.reverse());
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/updateuser/${editId}`,
          data
        );
        if (res.status === 200) {
          toast.success("User updated successfully");
        } else {
          toast.error("Failed to update user");
        }
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/createuser`,
          data
        );
        if (res.status === 200) {
          toast.success("User created successfully");
        } else {
          toast.error("Failed to create user");
        }
      }

      fetchUsers();
      setData({ name: "", email: "", password: "" });
      setEditId(null);
    } catch (err) {
      console.log("Submit error:", err);
      toast.error("Server error during submission");
    }
  };

  const handleEdit = (user) => {
    setData({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    setEditId(user._id);
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCancelEdit = () => {
    setEditId(null); 
    setData({ name: "", email: "", password: "" }); 
    toast.info("Edit canceled");
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteuser/${id}`
      );
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.log("Delete error:", err);
      toast.error("Server error during deletion");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-6">
      {/* FORM */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-slate-700 to-slate-800 border border-gray-600 shadow-2xl w-full md:w-1/2 mx-auto space-y-4 p-8 rounded-xl transition-transform hover:scale-[1.01]"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-100 tracking-wide">
          {editId ? "Edit User" : "Create User"}
        </h1>
        <input
          placeholder="Name"
          className="p-3 w-full rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          name="name"
          value={data.name}
          onChange={handleChange}
        />
        <input
          placeholder="Email"
          className="p-3 w-full rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          name="email"
          value={data.email}
          onChange={handleChange}
        />
        <input
          placeholder="Password"
          className="p-3 w-full rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          name="password"
          value={data.password}
          onChange={handleChange}
        />

        <div className="flex gap-4 justify-center">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
          >
            <FaUserPlus /> {editId ? "Update User" : "Create User"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg shadow transition"
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>
      </form>

      {/* USERS LIST */}
      <h2 className="text-gray-100 text-center mt-10 text-2xl font-semibold">Users List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-transform"
          >
            <p className="text-gray-200"><strong>Name:</strong> {user.name}</p>
            <p className="text-gray-300"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-400"><strong>Password:</strong> {user.password}</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleEdit(user)}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Createform;
