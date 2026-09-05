
export default function Page() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Transaction Ledger</h2>
        <p className="text-gray-500 mt-1">Real-time stream of all recovery-related payment events.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Txn ID</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">txn_9281a</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Globex</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹12,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">UPI</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md inline-block">Failed (R04)</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">txn_9281b</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Soylent</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹4,500</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Card</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">Recovered</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">txn_9281c</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Initech</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹85,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Bank Transfer</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md inline-block">Pending</span></td>
                </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
