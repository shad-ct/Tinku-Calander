import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, MapPin, Image as ImageIcon, Loader2, Lock, Unlock } from 'lucide-react';
import { createEvent, getEvents, deleteEvent } from '../services/api';
import { format } from 'date-fns';

interface Event {
    _id: string;
    title: string;
    start: string;
    location?: string;
}

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [adminPass, setAdminPass] = useState(''); // Store validated password

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        // Basic check - in real app, verify token with backend
        const savedPass = localStorage.getItem('adminPass');
        if (savedPass) {
            setAdminPass(savedPass);
            setIsAuthenticated(true);
            fetchEvents();
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, we would validate against server here.
        // For this simple requirement, we just state locally and try the API call later.
        if (password) {
            setAdminPass(password);
            setIsAuthenticated(true);
            localStorage.setItem('adminPass', password);
            fetchEvents();
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setAdminPass('');
        setPassword('');
        localStorage.removeItem('adminPass');
        setEvents([]);
    };

    const fetchEvents = async () => {
        try {
            const res = await getEvents();
            setEvents(res.data);
        } catch (error) {
            console.error("Failed to fetch events", error);
        }
    };

    const calculateEndDate = (startDateString: string) => {
        if (!startDateString) return '';
        const date = new Date(startDateString);
        date.setHours(date.getHours() + 1);
        const pad = (n: number) => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStart(e.target.value);
        if (!end) {
            setEnd(calculateEndDate(e.target.value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('start', start);
        formData.append('end', end);
        formData.append('location', location);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            await createEvent(formData, adminPass); // Pass password
            // Reset form
            setTitle('');
            setStart('');
            setEnd('');
            setLocation('');
            setDescription('');
            setImage(null);
            fetchEvents();
            alert('Event Created Successfully!');
        } catch (error: any) {
            console.error("Failed to create event", error);
            if (error.response && error.response.status === 401) {
                alert("Unauthorized! Incorrect Password.");
                handleLogout();
            } else {
                alert('Failed to create event.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent(id, adminPass); // Pass password
            fetchEvents();
        } catch (error: any) {
            console.error("Failed to delete event", error);
            if (error.response && error.response.status === 401) {
                alert("Unauthorized! Incorrect Password.");
                handleLogout();
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center transition-colors">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Access Required</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Please enter the administrator password to manage events.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                        <Unlock size={18} /> Unlock Dashboard
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Event Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Plus className="text-indigo-600 dark:text-indigo-400" /> Create New Event
                    </h2>
                    <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium">Log out</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date & Time</label>
                            <input
                                type="datetime-local"
                                required
                                value={start}
                                onChange={handleStartChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date & Time</label>
                            <input
                                type="datetime-local"
                                required
                                value={end}
                                onChange={e => setEnd(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={e => setImage(e.target.files ? e.target.files[0] : null)}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                        {image && <p className="text-sm text-green-600 dark:text-green-400 mt-2">Selected: {image.name}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Event'}
                    </button>
                </form>
            </div>

            {/* Existing Events List */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    Existing Events
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {events.map(event => (
                        <div key={event._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-600 hover:shadow-md transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-500">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{event.title}</h3>
                                <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-2 mt-1">
                                    <Calendar size={14} />
                                    {format(new Date(event.start), 'MMM d, yyyy - h:mm a')}
                                </div>
                                {event.location && (
                                    <div className="text-xs text-gray-400 dark:text-gray-400 flex items-center gap-2 mt-1">
                                        <MapPin size={12} />
                                        {event.location}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => handleDelete(event._id)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                title="Delete Event"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {events.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">No events found.</p>}
                </div>
            </div>
        </div>
    );
}
