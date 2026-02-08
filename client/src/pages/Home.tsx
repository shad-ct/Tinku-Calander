import CalendarGrid from '../components/CalendarGrid';

export default function Home() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                    Community Calendar
                </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <CalendarGrid />
            </div>
        </div>
    );
}
