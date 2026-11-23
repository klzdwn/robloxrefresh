import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic'; // Wajib biar gak di-cache Vercel

export async function GET() {
  const cookie = process.env.ROBLOX_COOKIE;
  
  if (!cookie) {
    return NextResponse.json({ error: 'Cookie belum di-set di Environment Variables' }, { status: 500 });
  }

  try {
    const headers = { 
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
    
    // Format Data
    const games = gamesRes.data.data.map(g => ({
      id: g.id,
      name: g.name,
      playTime: (Math.random() * 10 + 2).toFixed(1), // Simulasi
      icon: `https://www.roblox.com/asset-thumbnail/image?assetId=${g.rootPlace.id}&width=150&height=150&format=png`
    }));

    const avatars = itemsRes.data.data.map((item) => ({
      id: item.assetId,
      name: item.name,
      value: (Math.random() * 800 + 10).toFixed(0), // Simulasi
      image: `https://www.roblox.com/asset-thumbnail/image?assetId=${item.assetId}&width=150&height=150&format=png`
    }));

    return NextResponse.json({
      userId,
      username: userRes.data.name,
      robux: econRes.data.robux || 0,
      rap: 0, // Placeholder
      avatarUrl: thumbRes.data.data[0].imageUrl,
      games,
      avatars
    });

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return NextResponse.json({ error: 'Gagal konek ke Roblox. Cek Cookie atau IP Vercel diblokir.' }, { status: 500 });
  }
}
