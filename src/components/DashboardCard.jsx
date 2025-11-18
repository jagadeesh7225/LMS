function DashboardCard({ label, value }) {
  
  // Returning UI for the statistic card
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
      {/* Label text */}
      <div className="text-lg text-gray-600">{label}</div>

      {/* Main card value */}
      <div className="text-4xl font-bold mt-4">{value}</div>
    </div>
  );
}

export default DashboardCard;