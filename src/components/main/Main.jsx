import React, { useState } from 'react';
import { HiMiniXMark } from 'react-icons/hi2';
import { data } from '../../data/data';
import { RiArrowLeftLine } from 'react-icons/ri';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

function Main({ isOpen, onClose }) {
  const [categoryStack, setCategoryStack] = useState([]);

  const handleCategoryClick = (category) => {
    if (category.subcategories) {
      setCategoryStack((prev) => [...prev, category]);
    }
  };

  const goBack = () => {
    setCategoryStack((prev) => prev.slice(0, -1));
  };

  const currentLevel = categoryStack.length;
  const currentCategory = categoryStack[categoryStack.length - 1];
  const getCategoriesAtLevel = (level) => {
    if (level === 0) return data.categories;
    return categoryStack[level - 1]?.subcategories || [];
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
          {categoryStack.length > 0 ? (
            <button
              onClick={goBack}
              className="text-[16px] flex items-center text-black"
            >
              <RiArrowLeftLine className="mr-4" />
              <span>{currentCategory?.name}</span>
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
            className="flex h-full w-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentLevel * 100}%)` }}
          >
            {[...Array(currentLevel + 1)].map((_, level) => (
              <div
                key={level}
                className="w-full shrink-0"
              >
                {getCategoriesAtLevel(level).map((category) => (
                  <div
                    key={category.slug}
                    onClick={() => handleCategoryClick(category)}
                    className="h-[61px] px-5 flex items-center justify-between text-[14px] text-black border-b border-[rgb(238,238,237)] cursor-pointer"
                  >
                    <span>{category.name}</span>
                    {category.subcategories && (
                      <span className="text-xl">
                        <MdOutlineKeyboardArrowRight />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Main;
