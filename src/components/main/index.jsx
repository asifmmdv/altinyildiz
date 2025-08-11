import React, { useState } from 'react';
import { HiMiniXMark } from 'react-icons/hi2';
import { data } from '../../data/data';
import { RiArrowLeftLine } from 'react-icons/ri';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import TopSwiper from './TopSwiper';
import ProductSwiper from './ProductSwiper';
function Main({ isOpen, onClose }) {
  const [categoryStack, setCategoryStack] = useState([]);

  const handleCategoryClick = (category) => {
    if (category.subcategories) {
      setCategoryStack((prev) => [...prev, category]);
    } else {
      onClose();
    }
  };

  const goBack = () => {
    setCategoryStack((prev) => prev.slice(0, -1));
  };

  const currentLevel = categoryStack.length;
  const currentCategory = categoryStack[currentLevel - 1];
  const getCategoriesAtLevel = (level) => {
    if (level === 0) return data.categories;
    return categoryStack[level - 1]?.subcategories || [];
  };

  return (
    <>
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
          <div className="flex h-[56px] items-center justify-between pl-5  w-full border-b border-[rgb(238,238,237)]">
            {categoryStack.length > 0 ? (
              <button
                onClick={goBack}
                className="text-[16px] flex items-center text-black cursor-pointer"
              >
                <RiArrowLeftLine className="mr-4 text-[20px]" />
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
              className="flex h-[56px] w-[52px] items-center justify-center cursor-pointer"
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
                  className="w-full shrink-0 h-full overflow-y-auto"
                >
                  {getCategoriesAtLevel(level).map((category) => (
                    <div
                      key={category.slug}
                      onClick={() => handleCategoryClick(category)}
                      className="h-[61px] px-5 flex items-center justify-between text-[14px] text-black border-b border-[rgb(238,238,237)] cursor-pointer transition-colors"
                    >
                      <span>{category.name}</span>
                      {category.subcategories && (
                        <MdOutlineKeyboardArrowRight className="text-xl" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
      <TopSwiper/>
      <section className='p-5'> 
        <div className='flex justify-between items-center'>
          <h2 className='font-medium text-[18px]'>FLAŞ ÜRÜNLER</h2>
          <h4 className='text-[12px]'>Tümünü gör</h4>
        </div>
      <ProductSwiper/>
      </section>
    </>
  );
}

export default Main;

