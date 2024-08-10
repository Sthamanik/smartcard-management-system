import React, { useContext, useEffect } from 'react';
import feeContext from '../../contexts/fees/feeContext'; 
import AuthContext from '../../contexts/auth/authContext';

const FeeList = () => {
  const { fees, fetchFees, loading: feesLoading, error: feesError } = useContext(feeContext);
  const { users, fetchUserDetails, loading: usersLoading, error: usersError } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchFees(); // Fetch fees
        await fetchUserDetails(); // Fetch user details
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Only call fetchData if it has not been called already
    if (!fees.length || !users.length) {
      fetchData();
    }
  }, [fetchFees, fetchUserDetails, fees.length, users.length]);

  if (feesLoading || usersLoading) {
    return <div>Loading...</div>;
  }

  if (feesError || usersError) {
    return <div>{feesError || usersError}</div>;
  }

  // Create a lookup for users by userId
  const userMap = users.reduce((map, user) => {
    map[user._id] = user;
    return map;
  }, {});

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold my-4">Fee List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Faculty</th>
              <th className="px-4 py-2 text-left">Batch</th>
              <th className="px-4 py-2 text-left">UID</th>
              <th className="px-4 py-2 text-left">Amount Due</th>
              <th className="px-4 py-2 text-left">Total Fee</th>
              <th className="px-4 py-2 text-left">Payment History</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => {
              const user = userMap[fee.userId]; // Get the user details
              return (
                <tr key={fee._id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{user ? user.name : 'N/A'}</td>
                  <td className="px-4 py-2">{user ? user.faculty : 'N/A'}</td>
                  <td className="px-4 py-2">{user ? user.batch : 'N/A'}</td>
                  <td className="px-4 py-2">{user ? user.uid : 'N/A'}</td>
                  <td className="px-4 py-2">{fee.amountDue}</td>
                  <td className="px-4 py-2">{fee.totalFee}</td>
                  <td className="px-4 py-2">
                    <table className="w-full border border-gray-300">
                      <thead>
                        <tr>
                          <th className="px-2 py-1 border-b border-gray-300 text-center">Payment ID</th>
                          <th className="px-2 py-1 border-b border-gray-300 text-center">Amount Paid</th>
                          <th className="px-2 py-1 border-b border-gray-300 text-center">Paid On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fee.paymentHistory.length > 0 ? (
                          fee.paymentHistory.map((payment) => (
                            <tr key={payment._id} className="border-t border-gray-200">
                              <td className="px-2 py-1 text-center">{payment._id}</td>
                              <td className="px-2 py-1 text-center">{payment.amountPaid}</td>
                              <td className="px-2 py-1 text-center">{new Date(payment.paidOn).toLocaleDateString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center py-2">No Payment History</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeList;
