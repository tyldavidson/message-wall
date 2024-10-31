import Image from "next/image";
import MessageWall from '@/components/MessageWall'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <MessageWall />
    </main>
  )
}
