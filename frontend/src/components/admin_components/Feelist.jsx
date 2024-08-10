import React, { useContext, useEffect, useState } from 'react';
import { Edit, Trash, Save, XCircle } from 'lucide-react';
import FeeContext from '../../contexts/fees/feeContext';

const FeeList = () => {
  const {
    fees,
    fetchFeeDetails,
    updateFeeDetails,
    deleteFee,
    loading,
    error,
  } = useContext(FeeContext);

  const [editableFeeId, setEditableFeeId] = useState(null);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    if (fees.length === 0) {
      fetchFeeDetails();
    }
  }, [fees, fetchFeeDetails]);

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
    await updateFeeDetails(feeId, editableData);
    setEditableFeeId(null);
  };

  // Handle cancel button click
  const handleCancel = () => {
    setEditableFeeId(null);
    setEditableData({});
  };

  // Handle delete button click
  const handleDelete = async (feeId) => {
    await deleteFee(feeId);
    fetchFeeDetails(); // Refetch fees after deletion
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
              <th className="px-4 py-2 text-left">Amount Paid</th>
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
                        value={editableData.amountPaid}
                        onChange={(e) => handleInputChange(e, 'amountPaid')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={editableData.dueDate?.split('T')[0]} // Adjust for date input
                        onChange={(e) => handleInputChange(e, 'dueDate')}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <textarea
                        value={editableData.paymentHistory.map(ph => `Amount: ${ph.amountPaid}, Date: ${new Date(ph.paidOn).toLocaleDateString()}`).join('\n')}
                        onChange={(e) => handleInputChange(e, 'paymentHistory')}
                        className="w-full border border-gray-300 rounded p-1"
                        readOnly
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{fee.userId}</td>
                    <td className="px-4 py-2">{fee.amountDue}</td>
                    <td className="px-4 py-2">{fee.amountPaid}</td>
                    <td className="px-4 py-2">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-2">
                      {fee.paymentHistory.map((ph, index) => (
                        <div key={index}>
                          Amount: {ph.amountPaid}, Date: {new Date(ph.paidOn).toLocaleDateString()}
                        </div>
                      ))}
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
                      <button
                        onClick={() => handleDelete(fee._id)}
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

export default FeeList;
