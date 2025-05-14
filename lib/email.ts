import emailjs from '@emailjs/browser';

type EmailParams = {
  nombres?: string;
  apellidos?: string;
  ciudad?: string;
  correo: string;
  telefono?: string;
  mensaje: string;
  [key: string]: unknown;
};

export const sendEmail = async (params: EmailParams) => {
  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      params,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
    );
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};