export default function UserTable({ users, onDeactivate }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-100">
            <th className="pb-2">Name</th>
            <th className="pb-2">Email</th>
            <th className="pb-2">Role</th>
            <th className="pb-2">Status</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-slate-50">
              <td className="py-2 text-ink">{u.name}</td>
              <td className="py-2 text-slate-500">{u.email}</td>
              <td className="py-2 capitalize">{u.role}</td>
              <td className="py-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    u.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                  }`}
                >
                  {u.isActive ? 'Active' : 'Deactivated'}
                </span>
              </td>
              <td className="py-2 text-right">
                {u.isActive && u.role !== 'admin' && (
                  <button
                    onClick={() => onDeactivate(u._id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
