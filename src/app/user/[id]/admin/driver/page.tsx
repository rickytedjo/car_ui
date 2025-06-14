'use client';

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Driver {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export default function DriverPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    status: 'Free',
  });
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  async function fetchData() {
    try {
      const dataRes = await api.get("/driver");
      setDrivers(dataRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setDrivers([]);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await api.patch(`/driver/${editId}`, form);
      } else {
        await api.post('/driver', form);
      }
      setShowModal(false);
      setForm({ name: '', status: 'Free' });
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error(editId ? 'Error editing driver:' : 'Error creating driver:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (driver: Driver) => {
    setForm({ name: driver.name, status: driver.status });
    setEditId(driver.id);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setForm({ name: '', status: 'Free' });
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;
    setSubmitting(true);
    try {
      await api.delete(`/driver/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting driver:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Driver</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary/90 transition-colors"
          onClick={() => { setShowModal(true); setEditId(null); setForm({ name: '', status: 'Free' }); }}
        >
          Create
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border border-muted overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-muted-foreground">Name</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Status</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Created At</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center text-muted-foreground py-8">Loading...</td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted-foreground py-8">No drivers found.</td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver.id}>
                  <td className="px-4 py-2">{driver.name}</td>
                  <td className="px-4 py-2">{driver.status}</td>
                  <td className="px-4 py-2">{driver.created_at}</td>
                  <td className="px-4 py-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 mr-2"
                      onClick={() => handleEdit(driver)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      onClick={() => handleDelete(driver.id)}
                      disabled={submitting}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for create/edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={handleModalClose}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit Driver' : 'Create Driver'}</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input className="w-full border rounded px-3 py-2" type="text" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select className="w-full border rounded px-3 py-2" name="status" value={form.status} onChange={handleChange} required>
                  <option value="Free">Free</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={handleModalClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
                  disabled={submitting}
                >
                  {submitting ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
