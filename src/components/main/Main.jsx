import React from 'react'
import { HiMiniXMark } from 'react-icons/hi2'

function Main({ isOpen, onClose }) {
  return (
    <aside
      className={`
        fixed inset-0 z-10 bg-black/40
        transition-opacity duration-300 ease-in-out
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      onClick={onClose}
    >
      <div
        className={`
          h-full w-[272px] bg-white shadow-md
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[56px] items-center justify-between pl-5 w-full">
          <img
            src="src/assets/img/logo.png"
            alt="logo"
            className="h-[16px] w-[148px]"
          />
          <button
            onClick={onClose}
            className="flex h-[56px] w-[52px] items-center justify-center"
          >
            <HiMiniXMark className="text-[22px]" />
          </button>
        </div>
        <div className="p-4 text-sm text-gray-700">
          Sidebar content goes here
        </div>
      </div>
    </aside>
  )
}

export default Main