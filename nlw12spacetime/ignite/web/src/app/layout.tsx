import { ReactNode } from 'react'
import './globals.css'
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from 'next/font/google'

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })
const baiJamjuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree',
})

export const metadata = {
  title: 'NLW 11 Spacetime / Ignite',
  description:
    'Uma capsula do tempo construida com ReactJS, NextJS, TailwindCSS e Tyhpescript',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} ${baiJamjuree.className} bg-gray-900 font-sams text-gray-100`}
      >
        {children}
      </body>
    </html>
  )
}
