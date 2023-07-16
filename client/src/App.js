import { useEffect, useState } from "react"
import ListHeader from "./components/ListHeader"
import ListItem from "./components/ListItem"
import Auth from "./components/Auth"
import REACT_APP_SERVER_URL from "./config"
import {useCookies} from 'react-cookie'

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [tasks, setTasks] = useState(null)
  const userEmail = cookies.Email
  const authToken = cookies.AuthToken

  const getData = async () => {
    try {
      const result = await fetch(`${REACT_APP_SERVER_URL}/todos/${userEmail}`)
      const json = await result.json()
      setTasks(json?.sort((a, b) => new Date(a.date) - new Date(b.date)))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (authToken) {
      getData()
    }
  }, [])

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader listName={"🏖️ Holiday List"} getData={getData} />
          <p className="user-email">Welcome back {userEmail.split('@')[0]}</p>
          {tasks?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </>
      )}
    </div>
  )
}

export default App
