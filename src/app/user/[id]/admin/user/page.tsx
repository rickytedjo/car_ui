'use client';

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  is_admin: boolean;
  last_viewed: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    is_admin: false,
  });
  const [submitting, setSubmitting] = useState(false);

  async function fetchData() {
    try {
      const dataRes = await api.get("/user");
      setUsers(dataRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/user', form);
      setShowModal(false);
      setForm({ username: '', email: '', password: '', is_admin: false });
      fetchData();
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary/90 transition-colors"
          onClick={() => setShowModal(true)}
        >
          Create
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border border-muted overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-muted-foreground">Username</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Email</th>
              <th className="px-4 py-2 text-left text-muted-foreground w-32">Password</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Is Admin</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Last Viewed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center text-muted-foreground py-8">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted-foreground py-8">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 text-2xl select-none w-32 truncate" style={{ fontFamily: 'monospace', maxWidth: 120 }}>{'•'.repeat(user.password.length)}</td>
                  <td className="px-4 py-2">{user.is_admin ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">{user.last_viewed}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Create User</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 font-medium">Username</label>
                <input className="w-full border rounded px-3 py-2" type="text" name="username" value={form.username} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input className="w-full border rounded px-3 py-2" type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input className="w-full border rounded px-3 py-2" type="password" name="password" value={form.password} onChange={handleChange} required />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_admin" name="is_admin" checked={form.is_admin} onChange={handleChange} />
                <label htmlFor="is_admin">Is Admin</label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
