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

  async function fetchData(){
    try { 
        setLoading(true);
        const dataRes = await api.get("/driver");
        setDrivers(dataRes.data?.data);

     }
    catch (error) {
        console.error("Error fetching drivers:", error);
        setDrivers([]);
    }
}


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Driver</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary/90 transition-colors">Create</button>
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
                  <td className="px-4 py-2">-</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
