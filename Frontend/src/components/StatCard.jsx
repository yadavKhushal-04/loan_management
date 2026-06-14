// reusable card used on the dashboard to display a single stat
// accepts a title, value, and optional color accent
const StatCard = ({ title, value, accent = "blue" }) => {
    const accents = {
        blue: "border-blue-500 text-blue-600",
        green: "border-green-500 text-green-600",
        red: "border-red-500 text-red-600",
        yellow: "border-yellow-500 text-yellow-600",
    }

    return (
        <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${accents[accent]}`}>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${accents[accent]}`}>{value}</p>
        </div>
    )
}

export default StatCard