
export default function Page() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Compliance & Audit Trail</h2>
        <p className="text-gray-500 mt-1">Immutable record of AI decisions for regulatory compliance.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event ID</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Decision</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Policy Gate</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">aud_001</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">APPROVED: SMS Link</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">GATE_INCENTIVE_OK</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">2026-09-03 14:21:00</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">0x8f4...2a1</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">aud_002</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md inline-block">BLOCKED: Discount</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">GATE_LTV_MINIMUM</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">2026-09-03 14:18:22</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">0x3b1...9c4</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">aud_003</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">APPROVED: Smart Retry</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">GATE_RETRY_LIMIT</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">2026-09-03 13:45:11</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">0x1c9...8d2</span></td>
                </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
