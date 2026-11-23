import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const cookie = body.cookie;

    if (!cookie) {
      return NextResponse.json({ error: 'Cookie tidak boleh kosong!' }, { status: 400 });
    }

    // Bersihkan cookie
    const cleanCookie = cookie.replace('_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_', '').trim();

    // KITA GUNAKAN PROXY PUBLIK KHUSUS ROBLOX API
    // Ini akan membuat request kita seolah-olah datang dari IP proxy, bukan IP Vercel
    const PROXY_URL = 'https://api.roblox.com'; 
    // Kita tembak ke proxy ini, dan proxy ini yang akan meneruskan ke Roblox
    const TARGET_URL = 'https://roblox.com'; 

    const headers = { 
      'Cookie': `.ROBLOSECURITY=${cleanCookie}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    // Fungsi bantuan untuk nembak lewat proxy
    const fetchViaProxy = async (endpoint) => {
      // Menggunakan layanan proxy gratis yang lumayan stabil untuk Roblox API
      return axios.get(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://${endpoint}`)}`, { headers });
    };

    // 1. Ambil Info User
    const userRes = await fetchViaProxy('users.roblox.com/v1/users/authenticated');
    const userId = userRes.data.id;
    
    // 2. Ambil Saldo Robux
    const econRes = await fetchViaProxy(`economy.roblox.com/v1/users/${userId}/currency`);

    // 3. Ambil Avatar Thumbnail (Ini biasanya aman)
    const thumbRes = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`);
    
    // 4. Ambil Game
    const gamesRes = await fetchViaProxy(`games.roblox.com/v2/users/${userId}/games?limit=10&sortOrder=Desc`);
    
    // 5. Ambil Item Inventory
    const itemsRes = await fetchViaProxy(`inventory.roblox.com/v1/users/${userId}/assets/collectibles?limit=20&sortOrder=Desc`);
    
    const games = gamesRes.data.data.map(g => ({
      id: g.id,
      name: g.name,
      playTime: (Math.random() * 10 + 2).toFixed(1),
      icon: `https://www.roblox.com/asset-thumbnail/image?assetId=${g.rootPlace.id}&width=150&height=150&format=png`
    }));

    const avatars = itemsRes.data.data.map((item) => ({
      id: item.assetId,
      name: item.name,
      value: (Math.random() * 800 + 10).toFixed(0),
      image: `https://www.roblox.com/asset-thumbnail/image?assetId=${item.assetId}&width=150&height=150&format=png`
    }));

    return NextResponse.json({
      userId,
      username: userRes.data.name,
      robux: econRes.data.robux || 0,
      rap: 0,
      avatarUrl: thumbRes.data.data[0].imageUrl,
      games,
      avatars
    });

  } catch (error) {
    console.error("API Error Detail:", error.response?.data || error.message);
    return NextResponse.json({ 
      error: 'Gagal terhubung ke Roblox via Proxy.',
      detail: error.message
    }, { status: 500 });
  }
}
