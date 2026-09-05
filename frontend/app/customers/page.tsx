
export default function Page() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer Risk Profiles</h2>
        <p className="text-gray-500 mt-1">LTV and recovery probability analysis across your customer base.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Segment</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">LTV</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Recoveries</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Health Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">Initech</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Enterprise</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹14,00,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">1</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">84/100</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">Umbrella Corp</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Mid-Market</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹2,50,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">0</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">95/100</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">Cyberdyne</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Enterprise</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">₹8,50,000</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">3</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">42/100</span></td>
                </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
