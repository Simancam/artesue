import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/propiedades');
  
  // Esta parte nunca se renderiza debido a la redirección
  return null;
}