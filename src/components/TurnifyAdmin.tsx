import React from 'react';
import { ArrowLeft, AlertTriangle, Check, X, CheckCircle } from 'lucide-react';
import type { ReturnData, ReturnItem } from '../types';

interface TurnifyAdminProps {
  returnsData: ReturnData[];
  navigate: (view: string, data?: ReturnData) => void;
}

export const TurnifyAdmin: React.FC<TurnifyAdminProps> = ({ returnsData, navigate }) => (
  <div className="max-w-7xl mx-auto p-6">
    <div className="mb-6">
      <button 
        onClick={() => navigate('landing')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">Manage return approvals and view analytics</p>
    </div>
    {/* Pending Approvals */}
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold flex items-center">
          <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
          Pending Approvals ({returnsData.filter(r => r.status === 'pending').length})
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {returnsData.filter(r => r.status === 'pending').map(returnItem => (
          <div key={returnItem.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{returnItem.rma_number}</h3>
                <p className="text-gray-600">{returnItem.po_number} • ${Number(returnItem.total_value).toFixed(2)}</p>
                <p className="text-sm text-gray-500">Created: {returnItem.created_at}</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </button>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center">
              <span className="mr-2">🤖</span>
              <span className="font-semibold text-blue-800">AI Recommendation: <span className="text-green-700">APPROVE</span> (Low Risk)</span>
              <span className="ml-2 text-xs text-blue-600">(AI auto-approves low-risk returns. High-risk returns are flagged for review.)</span>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Return Items</h4>
              <div className="space-y-2">
                {returnItem.items.map((item: ReturnItem, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.title} (UPC: {item.upc})</span>
                    <span>Qty: {item.qty} • Reason: {item.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Analytics Summary */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Return Trends</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">CP Store Mumbai</span>
            <span className="font-medium">29 returns</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Alerts</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-sm">3 high-value returns</span>
          </div>
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm">1 fraud alert</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm">All systems normal</span>
          </div>
        </div>
      </div>
    </div>
  </div>
); 