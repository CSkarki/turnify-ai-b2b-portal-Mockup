import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { ReturnItem, ReturnData } from '../types';

interface TurnifyApprovalCheckProps {
  selectedItems: ReturnItem[];
  returnQuantities: Record<string, number>;
  returnReasons: Record<string, string>;
  returnComments: Record<string, string>;
  returnsData: ReturnData[];
  addNewReturn: (newReturn: ReturnData) => void;
  navigate: (view: string) => void;
}

export const TurnifyApprovalCheck: React.FC<TurnifyApprovalCheckProps> = ({ selectedItems, returnQuantities, returnReasons, returnComments, returnsData, addNewReturn, navigate }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
      const totalValue = selectedItems.reduce((sum, item, index) => sum + ((item.price || 0) * (returnQuantities[`${item.upc}_${item.po_number || (item.isOpenRA ? 'OPEN-RA' : '')}_${index}`] || item.return_qty || 1)), 0);
      const hasOpenRA = selectedItems.some(item => item.isOpenRA);
      if (hasOpenRA) {
        setApprovalStatus('pending');
        setAiRecommendation('Open RA returns require manual review. Our team will contact you within 24 hours.');
      } else if (totalValue > 1000) {
        setApprovalStatus('pending');
        setAiRecommendation('High-value return detected. Manual approval required for amounts over $1,000.');
      } else if (totalValue > 500) {
        setApprovalStatus('approved');
        setAiRecommendation('Return approved with standard processing. Shipping label will be generated.');
      } else {
        setApprovalStatus('approved');
        setAiRecommendation('Quick approval granted. Return meets all criteria for immediate processing.');
      }
      const newReturn: ReturnData = {
        id: Date.now(),
        rma_number: `RMA-${new Date().getFullYear()}-${String(returnsData.length + 1).padStart(3, '0')}`,
        po_number: selectedItems[0]?.isOpenRA ? 'OPEN-RA' : selectedItems[0]?.po_number || 'N/A',
        status: hasOpenRA || totalValue > 1000 ? 'pending' : 'approved',
        created_at: new Date().toISOString().split('T')[0],
        total_value: totalValue,
        items: selectedItems.map((item, index) => {
          const itemKey = `${item.upc}_${item.po_number || (item.isOpenRA ? 'OPEN-RA' : '')}_${index}`;
          return {
            upc: item.upc,
            title: item.title,
            qty: returnQuantities[itemKey] || item.return_qty || 1,
            reason: returnReasons[itemKey] || item.reason || 'Not specified',
            comment: returnComments[itemKey] || ''
          };
        }),
        approval_needed: hasOpenRA || totalValue > 1000,
        approver: hasOpenRA || totalValue > 1000 ? null : 'Auto-approved',
        tracking_number: hasOpenRA || totalValue > 1000 ? null : `1Z999AA${Date.now().toString().slice(-10)}`
      };
      addNewReturn(newReturn);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('return-details')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Return Details
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Return Approval Check</h1>
        <p className="text-gray-600 mt-2">Turnify AI is analyzing your return request</p>
      </div>
      {isChecking ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Analyzing Return Request</h2>
          <p className="text-gray-600">Turnify AI is evaluating your return against our policies...</p>
          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center"><span className="mr-2">✓</span>Checking return eligibility</div>
            <div className="flex items-center justify-center"><span className="mr-2">✓</span>Validating product information</div>
            <div className="flex items-center justify-center"><span className="mr-2">✓</span>Reviewing customer history</div>
            <div className="flex items-center justify-center"><span className="mr-2">✓</span>Applying custom approval logic</div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center"><span className="mr-2">🤖</span>AI Recommendation</h3>
            <p className="text-blue-700">{aiRecommendation}</p>
          </div>
          <div className={`rounded-lg p-6 ${approvalStatus === 'approved' ? 'bg-green-50 border border-green-200' : approvalStatus === 'rejected' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center mb-4">
              {approvalStatus === 'approved' && (<CheckCircle className="h-8 w-8 text-green-600 mr-3" />)}
              {approvalStatus === 'rejected' && (<XCircle className="h-8 w-8 text-red-600 mr-3" />)}
              {approvalStatus === 'pending' && (<Clock className="h-8 w-8 text-yellow-600 mr-3" />)}
              <div>
                <h2 className="text-xl font-semibold">{approvalStatus === 'approved' ? 'Return Approved' : approvalStatus === 'rejected' ? 'Return Rejected' : 'Manual Review Required'}</h2>
                <p className="text-sm text-gray-600">{approvalStatus === 'approved' ? 'Your return has been approved and is being processed' : approvalStatus === 'rejected' ? 'Your return request has been rejected' : 'Your return requires manual review by our team'}</p>
              </div>
            </div>
            {selectedItems.some(item => item.isOpenRA) && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Open RA Processing</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Manual verification of product details required</li>
                  <li>• Price validation needed</li>
                  <li>• Expected processing time: 24-48 hours</li>
                  <li>• You will receive an email with next steps</li>
                </ul>
              </div>
            )}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Next Steps:</h4>
              <ul className="text-sm space-y-1">
                {approvalStatus === 'approved' && (<><li>• Shipping label will be emailed within 1 hour</li><li>• Package your items securely</li><li>• Drop off at any authorized carrier location</li><li>• Track your return in the portal</li></>)}
                {approvalStatus === 'pending' && (<><li>• Our team will review your return within 24 hours</li><li>• You'll receive an email with the decision</li><li>• Check your email for updates</li><li>• Contact support if you have questions</li></>)}
                {approvalStatus === 'rejected' && (<><li>• Review the rejection reason</li><li>• Contact support for clarification</li><li>• Consider alternative return options</li></>)}
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Return Summary</h3>
            <div className="space-y-3">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.isOpenRA ? `Open RA - ${item.upc}` : `UPC: ${item.upc}`}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Qty: {item.return_qty || 1}</p>
                    <p className="text-sm text-gray-600">${item.price ? Number(item.price).toFixed(2) : 'TBD'} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-end space-x-4">
        <button 
          onClick={() => navigate('return-details')}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        {!isChecking && (
          <button 
            onClick={() => navigate('landing')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}; 