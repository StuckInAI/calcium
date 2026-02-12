import Calculator from '@/components/Calculator'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            {process.env.NEXT_PUBLIC_APP_NAME || 'Calcium'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            A modern calculator for your daily productivity
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <p>Basic calculator with arithmetic operations. Use buttons or keyboard for input.</p>
          </div>
        </header>
        
        <Calculator />
        
        <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Built with Next.js and TypeScript • Designed for productivity</p>
        </footer>
      </div>
    </main>
  )
}
