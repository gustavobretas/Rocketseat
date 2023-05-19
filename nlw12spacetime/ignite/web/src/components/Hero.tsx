import Image from 'next/image'
import nlwlogo from '@/assets/nlw-spacetime-logo.svg'

export function Hero() {
  return (
    <div className="space-y-5">
      <Image src={nlwlogo} alt="NLW Spacetime Logo" />
      <div className="max-w-[420px] space-y-1">
        <h1 className="text-5xl font-bold leading-tight text-gray-50">
          Sua cápsula do tempo
        </h1>
        <p className="text-lg leading-relaxed">
          Colecione momentos marcantes da sua jornmada e compartilhe (se quiser)
          com o mundo.
        </p>
      </div>
      <a
        href=""
        className="inline-block rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Cadastrar Lembrança
      </a>
    </div>
  )
}
