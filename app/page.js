'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [cookie, setCookie] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    if (!cookie) {
      setError('Masukkan cookie dulu bos!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/stats', { cookie });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Cookie salah atau expired.');
      setData(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-darkBg text-white p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-4 gap-4">
        <h1 className="text-2xl font-bold text-robloxYellow">My Stats Dashboard</h1>
        
        <div className="flex w-full md:w-auto gap-2">
          <input 
            type="password" 
            placeholder="Masukkan Cookie .ROBLOSECURITY" 
            className="bg-cardBg border border-gray-700 rounded px-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:border-robloxYellow"
            value={cookie}
            onChange={(e) => setCookie(e.target.value)}
          />
          <button 
            onClick={handleFetch} 
            className="bg-robloxYellow text-black px-6 py-2 rounded font-bold hover:bg-yellow-500 transition whitespace-nowrap"
          >
            {loading ? '...' : 'Connect'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-4 border border-red-800">{error}</div>}

      {data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <p>Masukkan Cookie di atas, lalu klik Connect.</p>
        </div>
      )}
    </div>
  );
}
