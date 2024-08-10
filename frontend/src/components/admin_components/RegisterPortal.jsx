import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../../contexts/auth/authContext';

const RegisterPortal = () => {
  const { signupUser } = useContext(authContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    DOB: '',
    gender: 'male',
    contact: '',
    role: 'user', // Default role is "user"
    faculty: '',
    batch: '',
    uid: '',
    key: '' // New field for admin role
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  
    try {
      const result = await signupUser(formData);
  
      if (result.success) {
        setError(null);
        setFormData({
          name: '',
          email: '',
          password: '',
          address: '',
          DOB: '',
          gender: 'male',
          contact: '',
          role: 'user',
          faculty: '',
          batch: '',
          uid: '',
          key: ''
        });
        navigate('/adminPanel/');
        setSuccess("Signup successful!");
      } else {
        setError(result.message || "Signup failed. Please try again.");
        setSuccess(null);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg  lg:max-w-4xl">
      <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-6 text-center text-gray-800">Register the user</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="DOB" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">Date of Birth:</label>
            <input
              type="date"
              id="DOB"
              name="DOB"
              value={formData.DOB}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="contact" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">Contact Number:</label>
            <input
              type="number"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {formData.role === 'user' && (
            <>
              <div>
                <label htmlFor="faculty" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">Faculty:</label>
                <input
                  type="text"
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="batch" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">Batch:</label>
                <input
                  type="number"
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="uid" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">UID:</label>
                <input
                  type="number"
                  id="uid"
                  name="uid"
                  value={formData.uid}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {formData.role === 'admin' && (
            <div>
              <label htmlFor="key" className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">Admin Key:</label>
              <input
                type="text"
                id="key"
                name="key"
                value={formData.key}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs md:text-sm lg:text-base focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-xs md:text-sm lg:text-base"
          >
            Register
          </button>
        </div>
      </form>
      {error && <p className="mt-4 text-red-600 text-xs md:text-sm lg:text-base">{error}</p>}
      {success && <p className="mt-4 text-green-600 text-xs md:text-sm lg:text-base">{success}</p>}
    </div>
  );
};

export default RegisterPortal;
