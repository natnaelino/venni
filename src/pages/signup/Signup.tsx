// third-party libraries
import React, { useState, useEffect, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Button } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import { WrappedFormUtils } from 'antd/es/form/Form'

// custom imports
import Logo from 'src/assets/logo.svg'
import { withFirebase } from 'src/firebase'
import { FirebaseCtx } from 'src/firebase/interfaces'
import * as firebaseErrorCodes from 'src/firebase/errorCodes'
import './Signup.less'

interface SignupProps extends FormComponentProps {
  firebase: FirebaseCtx
}

interface FormValues {
  name: string
  email: string
  password: string
  readonly [x: string]: string
}

const Signup: React.FC<SignupProps> = props => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    window.document.title = 'Get started - Venni'
  }, [])

  const handleErrors = (
    form: WrappedFormUtils<SignupProps>,
    values: FormValues,
    error: any
  ): void => {
    const errorMatcher: firebaseErrorCodes.ErrorMatcher = {
      [firebaseErrorCodes.AUTH_INVALID_EMAIL]: 'email',
      [firebaseErrorCodes.AUTH_CONFLICTING_EMAIL]: 'email',
      [firebaseErrorCodes.AUTH_WEAK_PASSWORD]: 'password'
    }

    form.setFields({
      [errorMatcher[error.code]]: {
        value: values[errorMatcher[error.code]],
        errors: [new Error(error.message)]
      }
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const { form, firebase } = props

    form.validateFieldsAndScroll(
      async (err, { name, email, password }: FormValues) => {
        if (!err) {
          try {
            setIsLoading(true)

            await firebase.createUser(name, email, password)
          } catch (err) {
            handleErrors(form, { name, email, password }, err)
            setIsLoading(false)
          }
        }
      }
    )
  }

  const { getFieldDecorator } = props.form

  return (
    <div className="signup" data-aos="zoom-in">
      <h2>We&apos;re glad to have you here</h2>
      <img className="signup__logo" src={Logo} alt="Venni Logo" />

      <Form onSubmit={handleSubmit} className="signup__form">
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Please input your name!'
              }
            ]
          })(
            <Input
              prefix={
                <Icon type="idcard" style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
              }
              placeholder="Your name"
              autoComplete="name"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email' }]
          })(
            <Input
              prefix={
                <Icon type="mail" style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
              }
              type="email"
              placeholder="Email"
              autoComplete="email"
            />
          )}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password' }]
          })(
            <Input.Password
              prefix={
                <Icon type="lock" style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
              }
              placeholder="Password"
              autoComplete="new-password"
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="signup__form__button"
            icon="rocket"
            loading={isLoading}
          >
            Sign up
          </Button>
          Or <Link to="/login">login instead</Link>
        </Form.Item>
      </Form>
    </div>
  )
}

export default withFirebase(
  Form.create<SignupProps>({ name: 'signup' })(Signup)
)
