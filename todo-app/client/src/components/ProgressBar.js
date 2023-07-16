import React from "react"

const ProgressBar = ({progress}) => {
  const colours = [
    'rgb(255,214,161)',
    'rgb(255,175,163)',
    'rgb(108,115,148)',
    'rgb(141,181,145)',

  ]
  const randomColour = colours[Math.floor(Math.random()*colours.length)]
  console.log(randomColour)
  return <div className="outer-bar">
    <div className="inner-bar"
    style={{width:`${progress}%`, 
    backgroundColor:randomColour
  }}
    >

    </div>
  </div>
}

export default ProgressBar
