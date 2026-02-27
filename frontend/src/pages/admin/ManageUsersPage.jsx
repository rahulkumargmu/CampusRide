import { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import AnimatedPage from "../../components/common/AnimatedPage";
import UserTable from "../../components/admin/UserTable";
import AddMemberForm from "../../components/admin/AddMemberForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getUsers, createUser, deleteUser } from "../../api/adminApi";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchUsers = () => {
    getUsers()
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (formData) => {
    await createUser(formData);
    setShowAdd(false);
    fetchUsers();
  };

  if (loading) return <><Navbar /><LoadingSpinner text="Loading users..." /></>;

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Users</h1>
            <p className="text-slate-400 mt-1">{users.length} total members</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl text-sm"
          >
            {showAdd ? "Cancel" : "+ Add Member"}
          </button>
        </div>

        {showAdd && (
          <div className="mb-8">
            <AddMemberForm onAdd={handleAdd} />
          </div>
        )}

        <UserTable users={users} onDelete={handleDelete} />
      </AnimatedPage>
    </>
  );
}
