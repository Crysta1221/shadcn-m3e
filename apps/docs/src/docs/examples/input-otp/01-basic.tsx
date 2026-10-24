import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/m3e/input-otp"

export const meta = {
  title: "6 digits",
}

export default function Demo() {
  return (
    <InputOTP
      aria-label="Verification code"
      maxLength={6}
      containerClassName="w-full max-w-sm"
    >
      <InputOTPGroup className="min-w-0 flex-1">
        <InputOTPSlot index={0} className="min-w-0 flex-1" />
        <InputOTPSlot index={1} className="min-w-0 flex-1" />
        <InputOTPSlot index={2} className="min-w-0 flex-1" />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup className="min-w-0 flex-1">
        <InputOTPSlot index={3} className="min-w-0 flex-1" />
        <InputOTPSlot index={4} className="min-w-0 flex-1" />
        <InputOTPSlot index={5} className="min-w-0 flex-1" />
      </InputOTPGroup>
    </InputOTP>
  )
}
