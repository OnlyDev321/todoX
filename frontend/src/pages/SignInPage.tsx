import { SignInForm } from "@/components/auth/signin-form";

const SignInPage = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
           radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%),
           radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
           radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%),
           radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%),
           linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
         `,
        }}
      />
      <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <SignInForm className={undefined} />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
