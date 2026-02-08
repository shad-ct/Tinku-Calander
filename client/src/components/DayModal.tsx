import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, MapPin, Clock } from 'lucide-react';
import { getComments, postComment } from '../services/api';

interface Event {
    _id: string;
    title: string;
    start: string;
    end: string;
    location?: string;
    description?: string;
    imageUrl?: string;
}

interface Comment {
    _id: string;
    content: string;
    author: string;
    timestamp: string;
}

interface DayModalProps {
    date: Date;
    events: Event[];
    onClose: () => void;
    refreshEvents: () => void;
}

export default function DayModal({ date, events, onClose }: DayModalProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [loadingComments, setLoadingComments] = useState(true);

    const dateStr = format(date, 'yyyy-MM-dd');

    useEffect(() => {
        fetchComments();
    }, [dateStr]);

    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            const res = await getComments(dateStr);
            setComments(res.data);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !authorName.trim()) return;

        try {
            await postComment({
                date: dateStr,
                content: newComment,
                author: authorName
            });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{format(date, 'EEEE, MMMM do')}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{events.length} Events Scheduled</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    {/* Events Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Events
                        </h3>
                        {events.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 italic text-center py-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">No events planned for this day.</p>
                        ) : (
                            <div className="space-y-4">
                                {events.map(event => (
                                    <div key={event._id} className="bg-white dark:bg-gray-800 border boundary-l-4 border-indigo-500 dark:border-indigo-400 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow dark:shadow-gray-900">
                                        {event.imageUrl && (
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover rounded-md mb-3" />
                                        )}
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{event.title}</h4>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} />
                                                {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={16} />
                                                    {event.location}
                                                </div>
                                            )}
                                        </div>
                                        {event.description && <p className="text-gray-700 dark:text-gray-300">{event.description}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Comments Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Community Discussion
                        </h3>

                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-4 mb-4">
                            {loadingComments ? (
                                <p className="text-center text-gray-500 dark:text-gray-400">Loading discussion...</p>
                            ) : comments.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 text-sm">Be the first to comment on this day!</p>
                            ) : (
                                <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                    {comments.map(comment => (
                                        <div key={comment._id} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm">{comment.author}</span>
                                                <span className="text-xs text-gray-400 dark:text-gray-400">{format(new Date(comment.timestamp), 'h:mm a')}</span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-200 text-sm">{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleCommentSubmit} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={authorName}
                                onChange={e => setAuthorName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                required
                            />
                            <textarea
                                placeholder="Ask a question or share a thought about this day..."
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm resize-none h-20"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition-colors flex justify-center items-center gap-2"
                            >
                                Post Comment
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
