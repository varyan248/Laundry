// components/StatCard.jsx
// ✅ We destructure 'icon' and rename it to 'Icon' (capitalized)
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`p-6 rounded-xl shadow-md bg-white border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 uppercase">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      {/* ✅ Change {icon} to <Icon /> */}
      <div className="text-gray-300">
        <Icon size={32} /> 
      </div>
    </div>
  </div>
);

export default StatCard;