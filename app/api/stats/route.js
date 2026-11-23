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

    const cleanCookie = cookie.replace('_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_', '').trim();

    const headers = { 
      'Cookie': `.ROBLOSECURITY=${cleanCookie}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Referer': 'https://www.roblox.com/',
      'Origin': 'https://www.roblox.com'
    };
    
    // 1. Ambil Info User
    const userRes = await axios.get('https://users.roblox.com/v1/users/authenticated', { headers });
    const userId = userRes.data.id;
    
    // 2. Ambil Saldo Robux
    const econRes = await axios.get(`https://economy.roblox.com/v1/users/${userId}/currency`, { headers });

    // 3. Ambil Avatar Thumbnail
    const thumbRes = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`);
    
    // 4. Ambil Game
    const gamesRes = await axios.get(`https://games.roblox.com/v2/users/${userId}/games?limit=10&sortOrder=Desc`);
    
    // 5. Ambil Item Inventory
    const itemsRes = await axios.get(`https://inventory.roblox.com/v1/users/${userId}/assets/collectibles?limit=20&sortOrder=Desc`, { headers });
    
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
    // Kalo error, kita kirim pesan error aslinya ke frontend biar ketahuan
    return NextResponse.json({ 
      error: 'Gagal terhubung ke Roblox.',
      detail: error.message
    }, { status: 500 });
  }
}
