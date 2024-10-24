import React from 'react'

// Importing Icons from "react-icons"
import { RiRefreshLine } from "react-icons/ri";


const RefreshButton = ({onClick}) => {
  return (
    <button onClick={onClick} className="refresh-button flex justify-center items-center gap-2 bg-gray-300 border-2 border-gray-400 text-tertiaryColor rounded-lg p-2">
        <RiRefreshLine className='w-5 h-5'/>
        <h1 className="text-base">Refresh</h1>
    </button>
  )
}

export default RefreshButton