import CommunityHub from '../components/CommunityHub';

export default function Community() {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Hub</h1>
                <p className="text-gray-500 dark:text-gray-400">Chat with others and suggest future events!</p>
            </div>

            <CommunityHub />
        </div>
    );
}
