import { useState, useEffect } from "react"
import TickIcon from "./TickIcon"
import ProgressBar from "./ProgressBar"
import Modal from "./Modal"
import REACT_APP_SERVER_URL from '../config'

const ListItem = ({ task, getData }) => {
  const [showModal, setShowModal] = useState(false)

  const deleteItem = async (e) => {
    e.preventDefault()
    try {
      const result = await fetch(
        `${REACT_APP_SERVER_URL}/todos/${task.id}`,
        {
          method: "Delete",
        }
      )
      console.log(result.status)
      if (result.status === 200) {
        console.log("Deleted")
        getData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="list-item">
      <div className="info-container">
        <TickIcon />
        <p className="task-title">{task.title}</p>
        <ProgressBar progress={task.progress} />
      </div>
      <div className="button-container">
        <button className="edit" onClick={() => setShowModal(true)}>
          Edit
        </button>
        <button className="delete" onClick={deleteItem}>
          Delete
        </button>
      </div>
      {showModal && (
        <Modal
          mode={"edit"}
          setShowModal={setShowModal}
          task={task}
          getData={getData}
        />
      )}
    </div>
  )
}

export default ListItem
