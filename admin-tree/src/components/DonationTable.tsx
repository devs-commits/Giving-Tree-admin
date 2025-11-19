import React from 'react';

interface Donation {
  id: number;
  accountNumber: string;
  charityName: string;
  wishName: string;
  amount: number;
  quantity: number;
  date: string;
}

interface DonationsTableProps {
  donations: Donation[];
}

const DonationsTable: React.FC<DonationsTableProps> = ({ donations }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">S/N</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Account Number</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Charity Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Wish Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Quantity</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, index) => (
            <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
              <td className="py-4 px-4 text-sm text-gray-900 font-mono">{donation.accountNumber}</td>
              <td className="py-4 px-4 text-sm text-gray-900">{donation.charityName}</td>
              <td className="py-4 px-4 text-sm text-gray-900">{donation.wishName}</td>
              <td className="py-4 px-4 text-sm text-gray-900 font-semibold">₦{donation.amount.toLocaleString()}</td>
              <td className="py-4 px-4 text-sm text-gray-900">{donation.quantity}</td>
              <td className="py-4 px-4 text-sm text-gray-600">{new Date(donation.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationsTable;