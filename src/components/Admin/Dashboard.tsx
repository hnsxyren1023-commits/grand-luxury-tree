import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import clsx from 'clsx';
import Lock from 'lucide-react/dist/esm/icons/lock';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Eye from 'lucide-react/dist/esm/icons/eye';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';

export const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [stats, setStats] = useState({ capsules: 0, views: 0 });
    const [capsules, setCapsules] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Simple hardcoded auth
    const handleLogin = () => {
        if (password === 'admin123') { // TODO: Change for prod
            setIsAuthenticated(true);
            fetchData();
        } else {
            alert('Invalid password');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Stats
            const { count: capsuleCount } = await supabase.from('capsules').select('*', { count: 'exact', head: true });
            const { count: viewCount } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'view');
            setStats({ capsules: capsuleCount || 0, views: viewCount || 0 });

            // Capsules List
            const { data } = await supabase
                .from('capsules')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            setCapsules(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this capsule? This cannot be undone.')) return;

        const { error } = await supabase.from('capsules').delete().eq('id', id);
        if (error) {
            alert('Error deleting');
        } else {
            fetchData(); // Refresh
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
                <div className="bg-zinc-900 p-8 rounded-xl border border-white/10 w-96 space-y-4">
                    <h2 className="text-xl text-yellow-500 font-bold flex items-center gap-2">
                        <Lock size={20} /> Admin Access
                    </h2>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full bg-black/50 border border-white/20 rounded p-2 text-white"
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                    <button onClick={handleLogin} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 rounded">
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-zinc-950 z-[9999] overflow-y-auto text-white font-sans">
            {/* Header */}
            <div className="border-b border-white/10 bg-zinc-900/50 backdrop-blur sticky top-0 px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-yellow-500">🎄 Christmas Tree</span> Admin
                </h1>
                <button onClick={fetchData} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <RefreshCw size={18} className={clsx(loading && "animate-spin")} />
                </button>
            </div>

            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                        <div className="text-white/50 text-sm uppercase tracking-wider">Total Capsules</div>
                        <div className="text-4xl font-bold mt-2 text-yellow-400">{stats.capsules}</div>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                        <div className="text-white/50 text-sm uppercase tracking-wider">Total Views</div>
                        <div className="text-4xl font-bold mt-2 text-blue-400">{stats.views}</div>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                        <div className="text-white/50 text-sm uppercase tracking-wider">Total Revenue</div>
                        <div className="text-4xl font-bold mt-2 text-green-400">$0.00</div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 font-bold">Recent Capsules</div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-white/50 uppercase text-xs">
                                <tr>
                                    <th className="p-4">Created At</th>
                                    <th className="p-4">Preview</th>
                                    <th className="p-4">Message</th>
                                    <th className="p-4">Music</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {capsules.map((capsule) => (
                                    <tr key={capsule.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white/60">
                                            {new Date(capsule.created_at).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            {capsule.photos && capsule.photos[0] && (
                                                <div className="w-16 h-16 bg-black rounded border border-white/10 overflow-hidden">
                                                    <img src={capsule.photos[0]} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 max-w-xs truncate" title={capsule.message}>
                                            {capsule.message || <span className="text-white/20 italic">No message</span>}
                                        </td>
                                        <td className="p-4 text-white/60">
                                            {capsule.music_id || 'Default'}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded">
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(capsule.id)}
                                                className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
