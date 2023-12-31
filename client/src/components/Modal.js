import { useState} from "react"
import {useCookies} from 'react-cookie'


const Modal = ({ mode, setShowModal, task, getData }) => {
  const [cookies] = useCookies(null)

  const editMode = mode === "edit"

  const [data, setData] = useState({
    id: editMode ? task.id : "",
    userEmail: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : "",
    progress: editMode ? task.progress : 0,
    date: editMode ? task.date : new Date(),
  })



  const postData = async (e) => {
    e.preventDefault()
    try {
      const result = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (result.status === 200) {
        console.log("Worked")
        setShowModal(false)
        getData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const editData = async (e) => {
    e.preventDefault()
    console.log(data.id)
    try {
      const result = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todos/${data.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      )
      if (result.status === 200) {
        console.log("Worked")
        setShowModal(false)
        getData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((i) => ({
      ...i,
      [name]: value,
    }))
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>
        <form>
          <input
            required
            maxLength={30}
            placeholder=" Your task goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="range">Drag to select your current progress</label>
          <input
            required
            type="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <input
            className="edit"
            type="submit"
            onClick={editMode ? editData : postData}
          />
        </form>
      </div>
    </div>
  )
}

export default Modal
