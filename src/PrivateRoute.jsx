import { useState } from 'react'

function PrivateRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [input, setInput] = useState('')

  const correctPassword = 'brooks123' // You can change this

  if (isAuthorized) {
    return children
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>This page is password protected.</h2>
      <input
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter password"
      />
      <button onClick={() => {
        if (input === correctPassword) {
          setIsAuthorized(true)
        } else {
          alert('Incorrect password')
        }
      }}>
        Enter
      </button>
    </div>
  )
}

export default PrivateRoute
