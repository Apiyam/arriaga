import InputMask from "react-input-mask";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
}

export function PhoneInput({ value, onChange, placeholder, name }: PhoneInputProps) {
  return (
    <InputMask
      mask="(999) 999-9999"
      value={value}
      onChange={onChange}
    >
      {(inputProps: any) => (
        <Input
          {...inputProps}
          placeholder={placeholder}
          name={name}
          className="rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition"
        />
      )}
    </InputMask>
  );
}