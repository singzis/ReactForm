import {
  useState,
  useRef,
  FormEvent,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react'
import clsx from 'clsx'
import FormContext from './FormContext'

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string
  style?: React.CSSProperties
  initialValues?: Record<string, any>
  children?: React.ReactNode
  onFinish?: (values: Record<string, any>) => void
  onFinishFailed?: (errorInfo: Record<string, any>) => void
}

const Form = forwardRef(
  (
    {
      initialValues,
      onFinish,
      onFinishFailed,
      className,
      style,
      children,
      ...rest
    }: FormProps,
    ref
  ) => {
    const [values, setValues] = useState<Record<string, any>>(
      initialValues || {}
    )
    const errors = useRef<Record<string, any>>({})
    const validatorMap = useRef(new Map<string, Function>())

    const classNames = clsx('form', className)

    useImperativeHandle(ref, () => ({
      getFieldValues: () => values,
      setFieldValues: (v: Record<string, any>) => {
        setValues(values => ({ ...values, ...v }))
      },
    }))

    useEffect(() => {
      console.log('values', values)
    }, [values])

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
        <form
          {...rest}
          className={classNames}
          style={style}
          onSubmit={handleSubmit}
        >
          {children}
        </form>
      </FormContext.Provider>
    )
  }
)

export default Form
