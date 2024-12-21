"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Eye } from "iconoir-react";
import { EyeIcon, Pen } from "lucide-react";

export default function App() {
  const [admins, setAdmins] = useState([]);
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/admin");
        console.log(response.data);
        let data = response.data.users;
        console.log(data);
        setAdmins(data);
        setAdminCount(data.length); 
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>; 
  }

  return (
    <>
      
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Admin Users{" "}
          <span className="text-pink-500">({adminCount})</span>
        </h3>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">
            <img className="w-4" src="/filter.png" alt="filter" /> Filters
          </button>
          <button
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Manage
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-gray-600 font-medium">Serial</th>
              <th className="px-6 py-3 text-gray-600 font-medium">User</th>
              <th className="px-6 py-3 text-gray-600 font-medium">Email</th>
              <th className="px-6 py-3 text-gray-600 font-medium">Role</th>
              <th className="px-6 py-3 text-gray-600 font-medium">Status</th>
              <th className="px-6 py-3 text-gray-600 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, idx) => (
              <tr key={admin.id} className="border-b">
                <td className="px-6 py-3">{idx + 1}</td>
                <td className="px-6 py-3">{admin.username}</td>
                <td className="px-6 py-3">{admin.email}</td>
                <td className="px-6 py-3">{admin.role}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      admin.active
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {admin.active?"Active":"Not Active"}
                  </span>
                </td>
                <td className="px-6 py-3 flex items-center gap-2">
                  <button className="text-blue-500 hover:underline"><EyeIcon/></button>
                  <button className="text-red-500 hover:underline text-sm">
                  <Edit/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {admins.length} admin{admins.length > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">
            Previous
          </button>
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
    </>
  );
}
