import React, { useContext, useEffect, useState } from 'react';
import { Edit, Trash, Save, XCircle } from 'lucide-react';
import AuthContext from '../../contexts/auth/authContext';

const UserList = () => {
  const { users, fetchUserDetails, updateUserDetails, deleteUser, loading, error } = useContext(AuthContext);
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    if (users.length === 0) {
      fetchUserDetails();
    }
  }, [users, fetchUserDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Sort users by role: admin first, then staff, then user
  const sortedUsers = [...users].sort((a, b) => {
    const roleOrder = { admin: 1, staff: 2, user: 3 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  // Handle input changes for editable fields
  const handleInputChange = (e, field) => {
    setEditableData({ ...editableData, [field]: e.target.value });
  };

  // Handle edit button click
  const handleEdit = (user) => {
    setEditableUserId(user._id);
    setEditableData(user);
  };

  // Handle save button click
  const handleSave = async (userId) => {
    await updateUserDetails(userId, editableData);
    setEditableUserId(null);
  };

  // Handle cancel button click
  const handleCancel = () => {
    setEditableUserId(null);
    setEditableData({});
  };

  // Handle delete button click
  const handleDelete = async (userId) => {
    await deleteUser(userId);
    fetchUserDetails(); // Refetch users after deletion
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold my-4">User List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Contact</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">DOB</th>
              <th className="px-4 py-2 text-left">Gender</th>
              <th className="px-4 py-2 text-left">Faculty</th>
              <th className="px-4 py-2 text-left">Batch</th>
              <th className="px-4 py-2 text-left">UID</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user._id} className="border-t border-gray-200">
                {editableUserId === user._id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editableData.name}
                        onChange={(e) => handleInputChange(e, 'name')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="email"
                        value={editableData.email}
                        onChange={(e) => handleInputChange(e, 'email')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editableData.contact}
                        onChange={(e) => handleInputChange(e, 'contact')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editableData.role}
                        onChange={(e) => handleInputChange(e, 'role')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editableData.address}
                        onChange={(e) => handleInputChange(e, 'address')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={editableData.DOB}
                        onChange={(e) => handleInputChange(e, 'DOB')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editableData.gender}
                        onChange={(e) => handleInputChange(e, 'gender')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editableData.faculty}
                        onChange={(e) => handleInputChange(e, 'faculty')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editableData.batch}
                        onChange={(e) => handleInputChange(e, 'batch')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editableData.uid}
                        onChange={(e) => handleInputChange(e, 'uid')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.contact}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">{user.address}</td>
                    <td className="px-4 py-2">{new Date(user.DOB).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{user.gender}</td>
                    <td className="px-4 py-2">{user.faculty || 'N/A'}</td>
                    <td className="px-4 py-2">{user.batch || 'N/A'}</td>
                    <td className="px-4 py-2">{user.uid || 'N/A'}</td>
                  </>
                )}
                <td className="px-4 py-2 text-center flex justify-center space-x-4">
                  {editableUserId === user._id ? (
                    <>
                      <button
                        onClick={() => handleSave(user._id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
