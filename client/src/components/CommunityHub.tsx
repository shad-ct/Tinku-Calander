import ChatRoom from './ChatRoom';
import SuggestionBox from './SuggestionBox';

export default function CommunityHub() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)] min-h-[600px]">
            {/* Chat Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white font-bold text-center text-lg tracking-wide shadow-md z-10">
                    Discussion Board
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <ChatRoom />
                </div>
            </div>

            {/* Suggestions Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white font-bold text-center text-lg tracking-wide shadow-md z-10">
                    Event Suggestions
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <SuggestionBox />
                </div>
            </div>
        </div>
    );
}
