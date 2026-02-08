import { useState, useEffect } from 'react';
import { ThumbsUp, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { getSuggestions, postSuggestion, voteSuggestion } from '../services/api';

interface Suggestion {
    _id: string;
    title: string;
    description: string;
    votes: number;
    status: 'pending' | 'approved' | 'rejected';
}

export default function SuggestionBox() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const res = await getSuggestions();
            setSuggestions(res.data);
        } catch (error) {
            console.error("Failed to fetch suggestions", error);
        }
    };

    const handleVote = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await voteSuggestion(id);
            fetchSuggestions();
        } catch (error: any) {
            console.error("Failed to vote", error);
            if (error.response && error.response.status === 403) {
                alert(error.response.data.message);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !desc.trim()) return;

        try {
            await postSuggestion({ title, description: desc });
            setTitle('');
            setDesc('');
            fetchSuggestions();
        } catch (error) {
            console.error("Failed to post suggestion", error);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900/10">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {suggestions.map(s => (
                    <div key={s._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${s.status === 'approved' ? 'bg-green-500' :
                            s.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>

                        <div className="flex justify-between items-start pl-3">
                            <div className="flex-1 pr-4">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{s.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 leading-relaxed">{s.description}</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${s.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        s.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                        {s.status}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={(e) => handleVote(s._id, e)}
                                className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-lg transition-colors group/vote"
                            >
                                <ThumbsUp className={`w-5 h-5 transition-transform group-hover/vote:-translate-y-0.5 ${s.votes > 0 ? 'fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500 group-hover/vote:text-purple-600 dark:group-hover/vote:text-purple-400'}`} />
                                <span className={`text-xs font-bold mt-1 ${s.votes > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>{s.votes}</span>
                            </button>
                        </div>
                    </div>
                ))}
                {suggestions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500">
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                            <PlusCircle size={32} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-sm">No suggestions yet. Be the first!</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 z-20 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Event Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-4 py-2 pl-9 rounded-xl bg-gray-50 dark:bg-gray-700 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 text-sm transition-all placeholder-gray-400"
                            required
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <PlusCircle size={16} className="text-purple-500" />
                        </div>
                    </div>
                    <textarea
                        placeholder="Describe your idea..."
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 text-sm resize-none h-20 transition-all placeholder-gray-400"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
                    >
                        <PlusCircle size={18} /> Submit Idea
                    </button>
                </form>
            </div>
        </div>
    );
}
