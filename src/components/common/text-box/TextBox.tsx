import './text-box.css';
import {FaInfo} from "react-icons/fa6";
import {CgDanger} from "react-icons/cg";
import {BiError} from "react-icons/bi";

interface TextBoxProps {
  className?: string;
  variant?: "default" | "secondary" | "warning" | "error";
  children?: React.ReactNode;
}


export default function TextBox({
                                  className = "",
                                  variant = "default",
                                  children
                                }: Readonly<TextBoxProps>) {

  const baseClasses = 'p-4 flex gap-2';

  const variantClasses = {
    default: 'text-box-primary',
    secondary: 'text-box-secondary',
    danger: 'text-box-danger',
    warn: 'text-box-warning',
  };

  const icon = (variant: string) => {
    switch (variant) {
      case "default":
        return <FaInfo/>;
      case "secondary":
        return <FaInfo/>;
      case "warning":
        return <CgDanger/>;
      case "error":
        return <BiError/>;
      default:
        return <FaInfo/>;
    }
  }

  return (
    <div className={variantClasses[variant] + " " + baseClasses + " " + className}>
      <div>
        {icon(variant)}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
