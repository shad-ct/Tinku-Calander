import { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { getChatMessages, postChatMessage } from '../services/api';
import { format } from 'date-fns';

interface Message {
    _id: string;
    content: string;
    author: string;
    timestamp: string;
    ipAddress?: string;
}

export default function ChatRoom() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [author, setAuthor] = useState('Happy User');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Polling every 3s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await getChatMessages();
            setMessages(res.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await postChatMessage({ content: newMessage, author });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-gray-900/50 scroll-smooth"
                style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            >
                {messages.map(msg => {
                    const isMe = msg.author === author;
                    return (
                        <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fadeIn`}>
                            <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isMe
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                    }`}>
                                    {msg.author}
                                    {msg.ipAddress && <span className="opacity-50 ml-1 text-[10px] font-normal">({msg.ipAddress})</span>}
                                </span>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                    {format(new Date(msg.timestamp), 'h:mm a')}
                                </span>
                            </div>
                            <div className={`
                                px-4 py-3 max-w-[85%] break-words shadow-sm text-sm
                                ${isMe
                                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm'
                                }
                            `}>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 z-20">
                <form onSubmit={handleSend} className="flex flex-col gap-3">
                    <div className="flex gap-2 items-center">
                        <div className="relative w-1/3 min-w-[120px]">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={author}
                                onChange={e => setAuthor(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border-none text-xs font-medium focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                                placeholder="Username"
                            />
                        </div>
                        <div className="text-[10px] text-gray-400 hidden sm:block">
                            posting as <span className="font-bold text-gray-600 dark:text-gray-300">{author}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                            placeholder="Type a message to the community..."
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
