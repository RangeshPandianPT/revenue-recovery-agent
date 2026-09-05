
export default function Page() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recovery Actions Log</h2>
        <p className="text-gray-500 mt-1">Audit trail of all interventions executed by the AI.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action ID</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th><th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">act_881</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">SMS_PAYMENT_LINK</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Acme Corp (+91 98***)</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">10 mins ago</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">Delivered</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">act_882</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">WHATSAPP_NUDGE</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Wayne Ent.</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">1 hr ago</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md inline-block">Read</span></td>
                </tr>
<tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">act_883</td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">SMART_RETRY</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">Globex</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-gray-600">2 hrs ago</span></td>
                  <td className="p-4 text-sm text-gray-600"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md inline-block">Success</span></td>
                </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
