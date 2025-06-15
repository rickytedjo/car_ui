'use client';

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Vehicle {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    status: 'Free',
  });
  const [submitting, setSubmitting] = useState(false);

  async function fetchData() {
    try {
      const dataRes = await api.get("/car");
      setVehicles(dataRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]);
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
      await api.post('/car', form);
      setShowModal(false);
      setForm({ name: '', status: 'Free' });
      fetchData();
    } catch (error) {
      console.error('Error creating vehicle:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Vehicle</h1>
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
              <th className="px-4 py-2 text-left text-muted-foreground">Name</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Status</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center text-muted-foreground py-8">Loading...</td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-muted-foreground py-8">No vehicles found.</td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="px-4 py-2">{vehicle.name}</td>
                  <td className="px-4 py-2">{vehicle.status}</td>
                  <td className="px-4 py-2">{vehicle.created_at}</td>
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
            <h2 className="text-2xl font-bold mb-4">Create Vehicle</h2>
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
