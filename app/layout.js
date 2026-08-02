import './globals.css'
import { Providers } from './providers'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = {
  title: 'MR.H Studio — Premium Computer & Coding Coaching in Roorkee',
  description: 'MR.H Studio, Roorkee — Learn Computer Basics, MS Office, C, Python, SQL and Power BI from a premium, career-focused coaching studio.',
  keywords: ['MR.H Studio','Roorkee coaching','computer classes Roorkee','python coaching','excel classes','power bi training'],
  openGraph: {
    title: 'MR.H Studio — Roorkee',
    description: 'Premium computer & coding coaching in Roorkee, India.',
    type: 'website'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#020617" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="bg-[#020617] text-white antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
