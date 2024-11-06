// app/layout.js
import { Playfair_Display } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Digital Ofrenda',
  description: 'Digital Ofrenda Message Wall',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={playfair.className}>{children}</body>
    </html>
  )
}