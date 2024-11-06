import { Playfair_Display } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair', // Add this line
})

export const metadata = {
  title: 'Digital Ofrenda',
  description: 'Digital Ofrenda Message Wall',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}