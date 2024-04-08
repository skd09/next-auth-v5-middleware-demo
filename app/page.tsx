import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-gradient-to-r from-purple-400 to-blue-800">
      <div className="space-y-6 text-center">
        <h1 className={`text-6xl font-semibold text-white drop-shadow-sm ${font.className}`}>
          🔐 Auth
        </h1>
        <p className="text-white text-lg"> 
          A simple authentication service
        </p>

      </div>
    </main>
  );
}
