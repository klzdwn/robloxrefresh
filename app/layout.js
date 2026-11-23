import './globals.css'

export const metadata = {
  title: 'Roblox Stats Dashboard',
  description: 'Cek statistik Roblox',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
