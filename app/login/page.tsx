import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login/login-form";
import Image from "next/image";
import { AuthProvider } from "@/components/login/context/authContext";

export default function LoginPage() {
  return (
    <AuthProvider>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Artesue
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <Image
            src="/login.svg"
            alt="Image"
            width={500}
            height={500}
            className="absolute inset-0 m-auto max-w-[80%] max-h-[80%] object-contain dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </AuthProvider>
  );
}