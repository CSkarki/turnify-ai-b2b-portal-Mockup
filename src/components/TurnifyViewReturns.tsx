import React from 'react';
import { Search, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import type { ReturnData, ReturnItem } from '../types';

interface TurnifyViewReturnsProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
  returnsData: ReturnData[];
  navigate: (view: string, data?: ReturnData) => void;
}

export const TurnifyViewReturns: React.FC<TurnifyViewReturnsProps> = React.memo(({ searchTerm, setSearchTerm, filterStatus, setFilterStatus, returnsData, navigate }) => {
  const filteredReturns = returnsData.filter(returnItem => {
    const matchesSearch = returnItem.rma_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.po_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || returnItem.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('landing')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <span className="mr-2">&#8592;</span>
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Return Requests</h1>
        <p className="text-gray-600 mt-2">Manage and track your return requests</p>
      </div>
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by RMA or PO number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select 
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="shipped">Shipped</option>
            </select>
          </div>
        </div>
      </div>
      {/* Returns List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Your Returns ({filteredReturns.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReturns.map(returnItem => (
            <div key={returnItem.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    returnItem.status === 'approved' ? 'bg-green-100' :
                    returnItem.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {returnItem.status === 'approved' ? 
                      <CheckCircle className="h-5 w-5 text-green-600" /> :
                      returnItem.status === 'pending' ?
                      <Clock className="h-5 w-5 text-yellow-600" /> :
                      <XCircle className="h-5 w-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{returnItem.rma_number}</h3>
                    <p className="text-gray-600">{returnItem.po_number} • Created: {returnItem.created_at}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">${Number(returnItem.total_value).toFixed(2)}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    returnItem.status === 'approved' ? 'bg-green-100 text-green-800' :
                    returnItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Items</p>
                  <p className="font-medium">{returnItem.items.length} items</p>
                </div>
                {returnItem.tracking_number && (
                  <div>
                    <p className="text-sm text-gray-600">Tracking</p>
                    <p className="font-medium">{returnItem.tracking_number}</p>
                  </div>
                )}
                {returnItem.approver && (
                  <div>
                    <p className="text-sm text-gray-600">Approved by</p>
                    <p className="font-medium">{returnItem.approver}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {returnItem.items.map((item: ReturnItem, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.title} (UPC: {item.upc})</span>
                      <span>{item.reason ?? 'No reason provided'}</span>
                      {item.comment && <span className="italic text-gray-400 ml-2">{item.comment}</span>}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate('return-details-view', returnItem)}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </button>
              </div>
              {returnItem.approver === 'Auto-approved' && (
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">AI Auto-Approved</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}); 