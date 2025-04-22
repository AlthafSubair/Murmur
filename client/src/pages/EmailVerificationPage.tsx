import {  Loader2,  MailCheck,  } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import OtpForm from "../components/OtpForm";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Data {
  otp: string;
  path: string | null;
}

const EmailVerificationPage = () => {

  
  
    const { isOtpResending, resendOtp, verifyOtp, isVerifyingOtp, email} = useAuthStore();
  const [time, setTime] = useState<number>(180)
  const [otp, setOtp] = useState<string>("")
  const [searchParams] = useSearchParams();
  const path: string | null = searchParams.get('path');
const navigate = useNavigate()

const data: Data = {
  otp,
  path
}
  
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(data)
      if(path){
        const res = await verifyOtp(data)
        if(res && path === "verify-email") {
          navigate('/login')
        }else if(res && path === "reset-password"){
          navigate(`/reset-password/${email}`)
        }
      }
  
    };
  
    useEffect(() => {
      if (time <= 0) return; // Stop the interval if time is 0 or less
  
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
  
      return () => clearInterval(interval);
    }, [time, resendOtp]); // Re-run the effect when time changes

    const handleResend = async() => {
      if(path){
        resendOtp(path)
      }
    }



  return (
    <div className="min-h-screen grid lg:grid-cols-2">
    {/* left side */}
    <div className="flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
            group-hover:bg-primary/20 transition-colors"
            >
              <MailCheck className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Verify Your Email</h1>
            <p className="text-base-content/60">We've sent a 4-digit OTP to your email. Enter it below to verify your account.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
         

            <OtpForm setOtptoString={setOtp}/>
       

         
          <button type="submit" className="btn btn-primary w-full" disabled={isVerifyingOtp}>
            {isVerifyingOtp ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-base-content/60">
            Did`t get the code?{" "}
           { time > 0 ? <span className="text-primary">
            {`${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`}
            </span> : 
            <button onClick={handleResend} className="link link-primary "> {isOtpResending ? (
              <>
           
             Resending...
              </>
            ) : (
              "Resend OTP"
            )}</button>}
          </p>
        </div>
      </div>
    </div>

    {/* right side */}

    <AuthImagePattern
      title="Verify Email"
      subtitle="Secure your account by entering the OTP we've sent to your registered email address."
    />

  </div>
  )
}

export default EmailVerificationPage