
export default function Page() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overdue Receivables</h2>
        <p className="text-gray-500 mt-1">B2B invoices that have crossed their due date.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice ID</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Days Overdue</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">INV-2024-081</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Acme Corp</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹45,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">14 Days</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md inline-block">Automated Reminder</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">INV-2024-077</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Massive Dynamic</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹2,10,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">45 Days</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md inline-block">Escalate to Human</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">INV-2024-092</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Hooli</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹12,500</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">3 Days</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-md inline-block">Smart Retry</span></td>
                </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
