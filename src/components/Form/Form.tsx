import { useState, useRef, FormEvent } from 'react'
import clsx from 'clsx'
import FormContext from './formContext'

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string
  style?: React.CSSProperties
  initialValues?: Record<string, any>
  children?: React.ReactNode
  onFinish?: (values: Record<string, any>) => void
  onFinishFailed?: (errorInfo: Record<string, any>) => void
}

const Form = ({
  initialValues,
  onFinish,
  onFinishFailed,
  className,
  style,
  children,
  ...rest
}: FormProps) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues || {})
  const errors = useRef<Record<string, any>>({})
  const validatorMap = useRef(new Map<string, Function>())

  const classNames = clsx('form', className)

  const onValuesChange = (key: string, value: any) => {
    values[key] = value
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    for (let [key, func] of validatorMap.current) {
      // validate
      if (typeof func === 'function') {
        errors.current[key] = func()
      }
    }

    const errorList = Object.values(errors.current).filter(Boolean)

    if (errorList.length) {
      onFinishFailed?.(errors.current)
    } else {
      onFinish?.(values)
    }
  }

  const handleValidateRegister = (name: string, callback: Function) => {
    validatorMap.current.set(name, callback)
  }

  return (
    <FormContext.Provider
      value={{
        values,
        setValues: v => setValues(v),
        onValueChange: onValuesChange,
        validateRegister: handleValidateRegister,
      }}
    >
      <form className={classNames} style={style} onSubmit={handleSubmit} {...rest}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

export default Form
