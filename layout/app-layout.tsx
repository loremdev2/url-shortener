import Header from '@/components/header';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div>
      
      <main className='min-h-screen contanier'>
        <Header />
        <Outlet />
      </main>

      <div className='text-center '>
        Made by <strong>Loremdev</strong>
      </div>
    </div>
  )
}

export default AppLayout
