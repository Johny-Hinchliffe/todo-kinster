import {useState} from "react"
import {useCookies} from 'react-cookie'
import Modal from './Modal'


const ListHeader = ({ listName, getData }) => {
  const [showModal, setShowModal] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(null)

  const signOut = () => {
    removeCookie('Email')
    removeCookie('AuthToken')
    window.location.reload()

  }
  return (
    <div className="list-header">
      {listName}
      <div className="button-container">
        <button className="create" onClick={() => setShowModal(true)}>ADD NEW</button>
        <button className="signout" onClick={signOut}>
          SIGN OUT
        </button>
      </div>
     {showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData} /> } 
    </div>
  )
}

export default ListHeader
