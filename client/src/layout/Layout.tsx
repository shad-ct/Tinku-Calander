import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Shield, Instagram, MessageCircle, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import logo from '../assets/image.png';
import tinkerhubLogo from '../assets/tinkerhub.png';
import { useTheme } from '../context/ThemeContext';

export default function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { path: '/', label: 'Calendar', icon: Calendar },
        { path: '/community', label: 'Community', icon: Users },
        { path: '/admin', label: 'Admin', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
            <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-2">
                                <img src={logo} alt="Tinku Logo" className="w-8 h-8 rounded-[30vh] object-contain" />
                                <span className="text-xl font-bold text-indigo-900 dark:text-indigo-400 tracking-tight">Tinku Calendar</span>
                            </Link>
                        </div>

                        <div className="flex space-x-4 items-center">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                                            isActive
                                                ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{item.label}</span>
                                    </Link>
                                );
                            })}

                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                                title="Toggle Theme"
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-12 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                        © {new Date().getFullYear()} Tinku Calendar. Built for the Community.
                    </div>

                    <div className="flex items-center gap-6">
                        <a
                            href="https://www.instagram.com/tinkerhubkuc/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-pink-600 transition-colors flex items-center gap-2 text-sm font-medium"
                            title="Instagram"
                        >
                            <Instagram size={20} />
                            <span className="hidden sm:inline">Instagram</span>
                        </a>

                        <a
                            href="https://app.tinkerhub.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            title="TinkerHub App"
                        >
                            <img src={tinkerhubLogo} alt="TinkerHub" className="w-5 h-5 object-contain" />
                            <span className="hidden sm:inline">TinkerHub App</span>
                        </a>

                        <a
                            href="https://chat.whatsapp.com/GpUJTAWggQ0L061oTyH0XS"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-green-500 transition-colors flex items-center gap-2 text-sm font-medium"
                            title="Join WhatsApp Group"
                        >
                            <MessageCircle size={20} />
                            <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
