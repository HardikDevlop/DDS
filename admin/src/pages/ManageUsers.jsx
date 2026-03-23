import { useEffect, useState } from "react";
import { PageLayout, PageSkeletonHeader, PageSkeletonTable } from "../Components/PageLayout";
import axios from "axios";
import { FiUsers, FiSearch } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/users`)
      .then((res) => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <PageLayout
      icon={FiUsers}
      title="User Management"
      subtitle="All registered users in the system"
      maxWidth="max-w-6xl"
      action={
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
          />
        </div>
      }
    >
      {isLoading ? (
        <>
          <PageSkeletonHeader />
          <PageSkeletonTable rows={8} />
        </>
      ) : (
        <div className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 sm:px-6 py-12 text-center text-slate-500 text-sm">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-sm shrink-0">
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-800 truncate max-w-[140px] sm:max-w-none">
                              {user.name}
                            </div>
                            <div className="text-xs text-slate-500 sm:hidden">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <span className="truncate max-w-[200px] block">{user.email}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-teal-600 hover:text-teal-700 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredUsers.length > 0 && (
            <div className="px-4 sm:px-6 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
              <span>
                Showing <span className="font-medium text-slate-700">1</span> to{" "}
                <span className="font-medium text-slate-700">{filteredUsers.length}</span> of{" "}
                <span className="font-medium text-slate-700">{filteredUsers.length}</span> results
              </span>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
