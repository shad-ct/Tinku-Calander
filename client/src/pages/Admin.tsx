import AdminPanel from '../components/AdminPanel';

export default function Admin() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500">Manage events and community suggestions.</p>
            </div>

            <AdminPanel />
        </div>
    );
}
