import React from "react";

export default function UserPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary/90 transition-colors">Create</button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border border-muted">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-muted-foreground">Username</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Email</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Password</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Is Admin</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Last Viewed</th>
            </tr>
          </thead>
          <tbody>
            {/* Empty table body */}
            <tr>
              <td colSpan={5} className="text-center text-muted-foreground py-8">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
