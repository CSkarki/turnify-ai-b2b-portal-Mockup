import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { ReturnItem } from '../types';

interface OpenRAForm {
  identifierType: string;
  productId: string;
  quantity: number;
  reason: string;
  comment?: string;
}

interface TurnifyOpenRAProps {
  navigate: (view: string) => void;
  openRAForm: OpenRAForm;
  setOpenRAForm: React.Dispatch<React.SetStateAction<OpenRAForm>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<ReturnItem[]>>;
}

export const TurnifyOpenRA: React.FC<TurnifyOpenRAProps> = ({ navigate, openRAForm, setOpenRAForm, setSelectedItems }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOpenRAForm(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) || 1 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!openRAForm.productId || !openRAForm.reason) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Check if "Other" reason is selected but no comment provided
    if (openRAForm.reason === 'Other' && !openRAForm.comment?.trim()) {
      alert('Comments are required when return reason is "Other". Please provide details.');
      return;
    }
    
    // Create Open RA item and add to selected items
    const openRAItem: ReturnItem = {
      upc: openRAForm.productId,
      title: `Open RA - ${openRAForm.productId}`,
      qty: openRAForm.quantity,
      price: 0, // Will be determined by system
      available_return: openRAForm.quantity,
      po_number: 'OPEN-RA',
      return_qty: openRAForm.quantity,
      reason: openRAForm.reason,
      isOpenRA: true
    };
    setSelectedItems([openRAItem]);
    navigate('return-details');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('landing')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Return Without Original Order</h1>
        <p className="text-gray-600 mt-2">Create an Open RA for items without a specific order reference</p>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">When to use Open RA:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Items received without a purchase order</li>
          <li>• Long-tail returns from old orders</li>
          <li>• Items with missing or incorrect order references</li>
          <li>• Special circumstances requiring manual processing</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Open RA Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Identifier Type *</label>
            <select 
              name="identifierType"
              value={openRAForm.identifierType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="upc">UPC</option>
              <option value="custom">Custom ID (SKU, etc.)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product ID *</label>
            <input
              type="text"
              name="productId"
              placeholder={`Enter  ${openRAForm.identifierType.toUpperCase()}...`}
              value={openRAForm.productId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={openRAForm.quantity}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return Reason *</label>
            <select 
              name="reason"
              value={openRAForm.reason}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a reason</option>
              <option value="Defective/Damaged">Defective/Damaged</option>
              <option value="Wrong Item Received">Wrong Item Received</option>
              <option value="No Longer Needed">No Longer Needed</option>
              <option value="Quality Issues">Quality Issues</option>
              <option value="Size/Fit Issues">Size/Fit Issues</option>
              <option value="Customer Request">Customer Request</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {openRAForm.reason && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments{openRAForm.reason === 'Other' ? ' *' : ''}
              </label>
              <textarea
                name="comment"
                value={openRAForm.comment || ''}
                onChange={e => setOpenRAForm(prev => ({ ...prev, comment: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  openRAForm.reason === 'Other' && !openRAForm.comment?.trim() 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder={
                  openRAForm.reason === 'Other' 
                    ? "Comments are required for 'Other' reason *" 
                    : "Add additional details (optional)"
                }
                rows={2}
                required={openRAForm.reason === 'Other'}
              />
              {openRAForm.reason === 'Other' && !openRAForm.comment?.trim() && (
                <p className="text-red-500 text-xs mt-1">Comments are required when reason is "Other"</p>
              )}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button 
            type="button"
            onClick={() => navigate('landing')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Continue to Return Details
          </button>
        </div>
      </form>
    </div>
  );
}; 