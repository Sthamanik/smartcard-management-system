import React, { useState, useContext } from "react";
import AuthContext from "../contexts/auth/authContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user', // Default to user
    key: '', 
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

    try {
      const result = await loginUser(formData);
      const role = formData.role;
      if (result.success) {
        setSuccess("Login successful!");
        setError(null);
        setFormData({ email: '', password: '', role: 'user', key: ''});

        if ( role === "admin") { navigate("/adminPage")}
        if ( role === "staff") { navigate("/staffPage")}
        if ( role === "user") { navigate("/userInterface")}
      } else {
        setError(result.message || "Login failed. Please try again.");
        setSuccess(null);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Role
            </label>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="user"
                name="role"
                value="user"
                checked={formData.role === 'user'}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="user" className="text-sm text-gray-600">User</label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="staff"
                name="role"
                value="staff"
                checked={formData.role === 'staff'}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="staff" className="text-sm text-gray-600">Staff</label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="admin"
                name="role"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="admin" className="text-sm text-gray-600">Admin</label>
            </div>
            {formData.role === 'staff' && (
              <div className="mb-6">
                <label htmlFor="staffKey" className="block mb-2 text-sm font-medium text-gray-600">
                  Staff Key
                </label>
                <input
                  type="text"
                  id="staffKey"
                  name="key"
                  value={formData.key}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Enter your staff key"
                />
              </div>
            )}
            {formData.role === 'admin' && (
              <div className="mb-6">
                <label htmlFor="adminKey" className="block mb-2 text-sm font-medium text-gray-600">
                  Admin Key
                </label>
                <input
                  type="text"
                  id="adminKey"
                  name="key"
                  value={formData.key}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Enter your admin key"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
          >
            Login
          </button>
          <div className="mt-6 text-center">
            <Link to="/signup" className="text-sm text-indigo-600 hover:underline">
              Are you an admin? SignUp
            </Link>
          </div>
        </form>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
      </div>
    </div>
  );
};

export default Login;
