import React from "react";

export default function VehiclePage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Vehicle</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border border-muted">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-muted-foreground">Name</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Status</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Created At</th>
            </tr>
          </thead>
          <tbody>
            {/* Empty table body */}
            <tr>
              <td colSpan={3} className="text-center text-muted-foreground py-8">No vehicles found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
