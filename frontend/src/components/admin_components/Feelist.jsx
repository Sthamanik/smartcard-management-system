import React, { useContext, useEffect, useState } from 'react';
import feeContext from '../../contexts/fees/feeContext'; // Ensure correct path
import { Edit, Save, XCircle } from 'lucide-react';

const FeeList = () => {
  const { fees, fetchFees, updateFee, loading, error } = useContext(feeContext);
  const [editableFeeId, setEditableFeeId] = useState(null);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    fetchFees(); // Fetch fees when the component mounts
  }, [fetchFees]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Handle input changes for editable fields
  const handleInputChange = (e, field) => {
    setEditableData({ ...editableData, [field]: e.target.value });
  };

  // Handle edit button click
  const handleEdit = (fee) => {
    setEditableFeeId(fee._id);
    setEditableData(fee);
  };

  // Handle save button click
  const handleSave = async (feeId) => {
    await updateFee(feeId, editableData);
    setEditableFeeId(null);
  };

  // Handle cancel button click
  const handleCancel = () => {
    setEditableFeeId(null);
    setEditableData({});
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold my-4">Fee List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Amount Due</th>
              <th className="px-4 py-2 text-left">Total Fee</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Payment History</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee._id} className="border-t border-gray-200">
                {editableFeeId === fee._id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editableData.userId}
                        onChange={(e) => handleInputChange(e, 'userId')}
                        className="w-full border border-gray-300 rounded p-1"
                        readOnly // userId should not be editable
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editableData.amountDue}
                        onChange={(e) => handleInputChange(e, 'amountDue')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editableData.totalFee}
                        onChange={(e) => handleInputChange(e, 'totalFee')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={editableData.dueDate?.slice(0, 10)}
                        onChange={(e) => handleInputChange(e, 'dueDate')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      {fee.paymentHistory.length > 0 ? (
                        <table className="w-full border border-gray-300">
                          <thead>
                            <tr>
                              <th className="px-2 py-1 border-b border-gray-300">Amount Paid</th>
                              <th className="px-2 py-1 border-b border-gray-300">Paid On</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fee.paymentHistory.map((payment, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="px-2 py-1">{payment.amountPaid}</td>
                                <td className="px-2 py-1">{new Date(payment.paidOn).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div>No Payment History</div>
                      )}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{fee.userId}</td>
                    <td className="px-4 py-2">{fee.amountDue}</td>
                    <td className="px-4 py-2">{fee.totalFee}</td>
                    <td className="px-4 py-2">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'No Due Date'}</td>
                    <td className="px-4 py-2">
                      {fee.paymentHistory.length > 0 ? (
                        <table className="w-full border border-gray-300">
                          <thead>
                            <tr>
                              <th className="px-2 py-1 border-b border-gray-300">Amount Paid</th>
                              <th className="px-2 py-1 border-b border-gray-300">Paid On</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fee.paymentHistory.map((payment, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="px-2 py-1">{payment.amountPaid}</td>
                                <td className="px-2 py-1">{new Date(payment.paidOn).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div>No Payment History</div>
                      )}
                    </td>
                  </>
                )}
                <td className="px-4 py-2 text-center flex justify-center space-x-4">
                  {editableFeeId === fee._id ? (
                    <>
                      <button
                        onClick={() => handleSave(fee._id)}
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
                        onClick={() => handleEdit(fee)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="w-5 h-5" />
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

export default FeeList;
