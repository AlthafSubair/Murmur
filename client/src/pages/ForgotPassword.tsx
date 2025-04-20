

import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link, useNavigate } from "react-router-dom";
import {  Loader2, Mail, MailCheck,  } from "lucide-react";

const ForgotPassword = () => {
 
  const [formData, setFormData] = useState({
    email: "",
  });

  const { isOtpResending, resendOtp, setEmail } = useAuthStore();
 
  
const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail(formData.email);
const res =  await resendOtp('reset-password')
console.log("res",res)
if(res) {
    
    navigate('/verify-email/?path=reset-password')
}
    
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MailCheck className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Forgot Password?</h1>
<p className="text-base-content/60">
  Enter your email to receive a verification code to reset your password.
</p>

            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 z-40 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

           
                  
            <button type="submit" className="btn btn-primary w-full" disabled={isOtpResending}>
              {isOtpResending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          <div className="text-center">
          <p className="text-base-content/60">
  Didn't request a password reset?{" "}
  <Link to="/login" className="link link-primary">
    Log in
  </Link>
</p>

          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
  title={"Let's verify your email!"}
  subtitle={
    "Type in your email and we'll send you a code to confirm it's really you."
}
/>

    </div>
  );
};
export default ForgotPassword;