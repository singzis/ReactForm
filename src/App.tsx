import { useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import styled from 'styled-components'
import From from './components/Form'

const StyledButton = styled.button.attrs({ type: 'submit' })`
  background-color: #61dafb;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
`

const StyledInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  padding: 10px;
`

const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 10px;
`

function App() {
  // 外部控制表单
  const form = useRef<Record<string, any>>({})

  const onFinish = (values: Record<string, any>) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: Record<string, any>) => {
    console.log('Failed:', errorInfo)
  }

  const onReset = () => {
    form.current.setFieldValues({
      admin: 'admin',
    })
  }

  const onLog = () => {
    console.log('values', form.current.getFieldValues())
  }

  return (
    <>
      <StyledButton onClick={onReset}>初始化admin</StyledButton>
      <StyledButton onClick={onLog}>打印</StyledButton>
      <From
        ref={form}
        initialValues={{
          admin: 'admin',
          password: 'xxxx122',
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <From.Item
          name="admin"
          label="admin"
          rules={[
            { required: true, message: 'please input your username' },
            { min: 4, message: 'username must be at least 4 characters' },
          ]}
        >
          <StyledInput />
        </From.Item>
        <From.Item
          name="password"
          label="password"
          rules={[
            { required: true, message: 'please input your password' },
            { min: 6, message: 'password must be at least 6 characters' },
          ]}
        >
          <StyledInput type="password" />
        </From.Item>
        <From.Item name="remember" valuePropName="checked">
          <StyledCheckbox />
        </From.Item>
        <From.Item>
          <StyledButton>Submit</StyledButton>
        </From.Item>
      </From>
    </>
  )
}

export default App
