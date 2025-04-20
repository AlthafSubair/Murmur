import React, {  useRef, useState } from "react"

// Define the type for the props
interface OtpFormProps {
    setOtptoString: (otp: string) => void; // This is the correct type for the setter function
  }

const OtpForm: React.FC<OtpFormProps> = ({setOtptoString}) => {

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
    const inputRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
     const otps = [...otp];
     otps[index] = e.target.value.slice(0, 1);
     setOtp(otps);
     if(e.target.value && index < otp.length - 1){
      inputRef.current[index + 1]?.focus();
     }
     setOtptoString(otps.join(""))
    }

    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>,index: number) => {
     if(e.key === "Backspace" && !otp[index]){
        inputRef.current[index - 1]?.focus();
     }   
    }

   


  return ( 
    <div className="form-control">
       <label className="label">
                <span className="label-text font-medium my-1">OTP</span>
              </label>
<div className="grid grid-cols-6 gap-2">
{otp.map((value, i) => (
              <input
                key={i}
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleBackspace(e, i)}
                ref={(el) => { inputRef.current[i] = el; }}
                className={`aspect-square rounded-2xl bg-primary/10 text-center`}
              />
            ))}
</div>
    </div>
  )
}

export default OtpForm