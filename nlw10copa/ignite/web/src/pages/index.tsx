// interface HomeProps {
//   nome: String;
// } 
import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-ckeck.svg';

export default function Home() {
  return (
    <div>
      <main>
        <Image src={logoImg} alt="Logo do Site" quality={100} />

        <h1>Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div>
          <Image src={usersAvatarExampleImg} alt="" quality={100} />
          <strong>
            <span>+12.592</span> pessoas já estão usando
          </strong>
        </div>

        <form action="">
          <input type="text" required placeholder='Qual nome do seu bolão?' />
          <button type="submit">Criar meu bolão</button>
        </form>

        <p>Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div>
          <div>
            <Image src={iconCheckImg} alt="" />
            <div>
              <span>+2.034</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div>
            <Image src={iconCheckImg} alt="" />
            <div>
              <span>+192.847</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// export async function getServerSideProps() {
//   const response = await fetch('http://srviis.tce.mt.gov.br:8081/controlp/rest/ConsultaRFB/GetCPF/10629254168/10629254168/CONTROLP')
//   const data = await response.json()
//   const Pessoa = data.result[0].PessoaPerfilD[0]
//   return {
//     props: {
//       nome: Pessoa.Nome,
//     }
//   }
// }
// <Image src={appPreviewImg} alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa" quality={100}/>