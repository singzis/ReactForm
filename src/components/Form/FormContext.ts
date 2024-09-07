import { createContext } from "react";

interface FormContextProps {
  values?: any;
  setValues?: (values: Record<string, any>) => void;
  onValueChange?: (key: string, value: any) => void;
  validateRegister?: (name: string, callback: Function) => void;
}

const FormContext = createContext<FormContextProps>({});

export default FormContext;
export type { FormContextProps };