// Este archivo debe estar en la raíz del proyecto (mismo nivel que package.json)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Esta función se ejecuta antes de que se renderice la página
export function middleware(request: NextRequest) {
  // Verifica todas las cookies que podrían indicar autenticación
  // Modifica esta lógica según tu sistema de autenticación
  const cookies = request.cookies
  
  // Revisa si existe alguna cookie relacionada con la autenticación
  // Esto es flexible y puedes adaptarlo según tus necesidades
  const hasAuthCookie = cookies.getAll().some(cookie => 
    cookie.name.includes('token') || 
    cookie.name.includes('auth') || 
    cookie.name.includes('session')
  )
  
  // Si están intentando acceder al dashboard directamente desde la URL 
  // Y no hay indicios de que estén autenticados
  if (request.nextUrl.pathname.startsWith('/dashboard') && 
      !hasAuthCookie && 
      request.headers.get('referer') === null) {
    
    // Solo redirige cuando parece ser un acceso directo por URL
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // En cualquier otro caso, permite que la lógica de autenticación existente maneje el flujo
  return NextResponse.next()
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: ['/dashboard/:path*']
}