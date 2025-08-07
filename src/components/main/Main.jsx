import React, { useState } from 'react';
import { HiMiniXMark } from 'react-icons/hi2';
import { data } from '../../data/data';
import { RiArrowLeftLine } from 'react-icons/ri';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

function Main({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (category) => {
    if (category.subcategories) {
      setActiveCategory(category);
    }
  };

  const goBack = () => {
    setActiveCategory(null);
  };

  return (
    <aside
      className={`
        fixed inset-0 z-10 bg-black/40
        transition-opacity duration-300 ease-in-out
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          h-full w-[272px] bg-white shadow-md
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[56px] items-center justify-between pl-5 pr-2 w-full border-b border-[rgb(238,238,237)]">
          {activeCategory ? (
            <button
              onClick={goBack}
              className="text-[16px] flex items-center text-black"
            >
              <RiArrowLeftLine className='mr-4'/>
              <span>KOLEKSIYON</span>
            </button>
          ) : (
            <img
              src="/img/logo.png"
              alt="logo"
              className="h-[16px] w-[148px]"
            />
          )}
          <button
            onClick={onClose}
            className="flex h-[56px] w-[52px] items-center justify-center"
          >
            <HiMiniXMark className="text-[22px] text-black" />
          </button>
        </div>

        <div className="relative w-full h-full overflow-hidden">
          <div
            className={`
              absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out
              ${activeCategory ? '-translate-x-full' : 'translate-x-0'}
            `}
          >
            {data.categories.map((category) => (
              <div
                key={category.slug}
                onClick={() => handleCategoryClick(category)}
                className="h-[61px] px-5 flex items-center justify-between text-[14px] text-black border-b border-[rgb(238,238,237)] cursor-pointer hover:bg-gray-50"
              >
                <span>{category.name}</span>
                {category.subcategories && <span className="text-xl"><MdOutlineKeyboardArrowRight /></span>}
              </div>
            ))}
          </div>
          <div
            className={`
              absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out
              ${activeCategory ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            {activeCategory &&
              activeCategory.subcategories.map((sub) => (
                <div
                  key={sub.slug}
                  className="h-[61px] p-5 flex items-center text-sm text-black border-b border-[rgb(238,238,237)] cursor-pointer"
                >
                  {sub.name}
                </div>
              ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Main;
