import { useState } from "react"
import REACT_APP_SERVER_URL from "../config"
import {useCookies} from 'react-cookie'

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogin, SetIsLogin] = useState(true)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)

  console.log(cookies)

  const viewLogin = (status) => {
    setError(null)
    SetIsLogin(status)
  }

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault()
    console.log(`${REACT_APP_SERVER_URL}/${endpoint}`)
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do no match!")
      return
    }
    const result = await fetch(`${REACT_APP_SERVER_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await result.json()
    if(data.detail){
      if(data.detail === `Key (email)=(${email}) already exists.`){
        setError('johny@test.com already has an account, try logging in')
      } else  setError(data.detail)
    } else {
      setCookie('Email', data.email)
      setCookie('AuthToken', data.token)
      window.location.reload()
    }
 
  }

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>{isLogin ? "Please log in" : "Please sign up!"}</h2>
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <input
            type="submit"
            className="create"
            onClick={(e) => handleSubmit(e, isLogin ? "login" : "signup")}
          />
          {error && <p>{error}</p>}
        </form>
        <div className="auth-options">
          <button
            onClick={() => viewLogin(false)}
            style={{
              backgroundColor: !isLogin
                ? "rgb(255,255,255)"
                : "rgb(188,188,188)",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => viewLogin(true)}
            style={{
              backgroundColor: isLogin
                ? "rgb(255,255,255)"
                : "rgb(188,188,188)",
            }}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
