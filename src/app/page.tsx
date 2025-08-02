import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full mt-16">
        <div className="mb-6">
          <Image
            src="/img.jpg"
            alt="Welcome Image"
            width={180}
            height={180}
            className="rounded-full shadow-lg"
            priority
          />
        </div>
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">Welcome to Users Management System</h1>
        <p className="text-lg text-gray-700 mb-2 text-center">
          Manage your users efficiently, securely, and with ease.
        </p>
        <p className="text-md text-gray-500 text-center mb-6">
          Start by logging in or registering a new account to access the dashboard.
        </p>
        <Link href="/login">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Go to Login</button>
        </Link>
      </div>
    </main>
  )
}
