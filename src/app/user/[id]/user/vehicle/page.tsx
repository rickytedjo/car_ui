"use client";

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

  async function fetchData() {
    try {
      const dataRes = await api.get("/car");
      setVehicles(dataRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Vehicle</h1>
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
    </>
  );
}
