import React from 'react';
import { ArrowLeft, CheckCircle, Truck, Download } from 'lucide-react';
import type { ReturnItem, ReturnData } from '../types';

interface TurnifyReturnDetailsViewProps {
  selectedReturn: ReturnData;
  returnsData: ReturnData[];
  navigate: (view: string) => void;
}

export const TurnifyReturnDetailsView: React.FC<TurnifyReturnDetailsViewProps> = ({ selectedReturn, returnsData, navigate }) => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="mb-6">
      <button 
        onClick={() => navigate('returns-list')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Returns List
      </button>
      <h1 className="text-3xl font-bold text-gray-900">Return Details</h1>
      <p className="text-gray-600 mt-2">{selectedReturn.rma_number || 'RMA-2024-001'}</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Return Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">RMA Number</p>
              <p className="font-medium">{selectedReturn.rma_number || 'RMA-2024-001'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PO Number</p>
              <p className="font-medium">{selectedReturn.po_number || 'PO-2024-001'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                (selectedReturn.status || 'approved') === 'approved' ? 'bg-green-100 text-green-800' :
                (selectedReturn.status || 'approved') === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {((selectedReturn.status || 'approved').charAt(0).toUpperCase() + (selectedReturn.status || 'approved').slice(1))}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="font-medium">${Number(selectedReturn.total_value || 562.50).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Return Items</h2>
          <div className="space-y-4">
            {(selectedReturn.items || returnsData[0]?.items || []).map((item, index) => (
              <div key={item.upc + '_' + index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">UPC: {item.upc}</p>
                    <p className="text-sm text-gray-600">Reason: {item.reason}</p>
                    {'comment' in item && (item as any).comment && (
                      <p className="text-sm text-gray-500 italic">Comment: {(item as any).comment}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Qty: {item.qty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Status Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Return Created</p>
                <p className="text-sm text-gray-600">{selectedReturn.created_at || '2024-03-22'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Approved</p>
                <p className="text-sm text-gray-600">2024-03-22</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Shipping Label Generated</p>
                <p className="text-sm text-gray-600">2024-03-22</p>
              </div>
            </div>
          </div>
        </div>
        {selectedReturn.tracking_number && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Tracking Number</p>
                <p className="font-medium">{selectedReturn.tracking_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Carrier</p>
                <p className="font-medium">UPS Ground</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Est. Delivery</p>
                <p className="font-medium">2024-03-25</p>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
              <Download className="h-4 w-4 mr-2" />
              Download Label
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
); 