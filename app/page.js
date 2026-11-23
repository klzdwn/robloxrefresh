'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/stats');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan sistem.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-darkBg text-white p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-robloxYellow">My Stats Dashboard</h1>
        <button 
          onClick={handleFetch} 
          className="bg-robloxYellow text-black px-6 py-2 rounded font-bold hover:bg-yellow-500 transition"
        >
          {loading ? 'Memuat Data...' : 'Load Data Akun'}
        </button>
      </div>

      {error && <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-4 border border-red-800">{error}</div>}

      {data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kiri: Profil & Saldo */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-cardBg p-6 rounded-xl border border-gray-800 flex items-center gap-4">
              <img src={data.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-lg bg-gray-800" />
              <div>
                <h2 className="text-xl font-bold">{data.username}</h2>
                <p className="text-gray-400 text-sm">ID: {data.userId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cardBg p-4 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-xs uppercase">Balance</p>
                <p className="text-2xl font-bold text-robloxYellow">R$ {data.robux}</p>
              </div>
              <div className="bg-cardBg p-4 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-xs uppercase">RAP</p>
                <p className="text-2xl font-bold text-robloxYellow">{data.rap}</p>
              </div>
            </div>
          </div>

          {/* Kanan: Games & Avatar Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-cardBg p-4 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold mb-4 border-l-4 border-robloxYellow pl-3">Top Games Played</h3>
              <div className="space-y-3">
                {data.games.map((game, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-800 rounded transition">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm w-4">{i + 1}</span>
                      <img src={game.icon} alt="icon" className="w-10 h-10 rounded bg-gray-700" />
                      <span className="font-medium text-sm">{game.name}</span>
                    </div>
                    <span className="text-robloxYellow font-bold text-sm">{game.playTime}h</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cardBg p-4 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold mb-4 border-l-4 border-robloxYellow pl-3">Avatar Value</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {data.avatars.map((item, i) => (
                  <div key={i} className="bg-darkBg p-2 rounded-lg text-center border border-gray-800">
                    <img src={item.image} alt={item.name} className="w-full aspect-square object-cover rounded mb-2 bg-gray-700" />
                    <p className="text-xs truncate text-gray-300">{item.name}</p>
                    <p className="text-sm font-bold text-robloxYellow mt-1">R$ {item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20 text-gray-500">
          <p>Klik "Load Data Akun" untuk melihat statistik.</p>
        </div>
      )}
    </div>
  );
}
