import React, { useState } from "react";
import { BsBoxSeam } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosHeartEmpty, IoIosSearch } from "react-icons/io";
import { PiBagLight } from "react-icons/pi";
import { VscAccount } from "react-icons/vsc";
import { RiArrowLeftLine } from "react-icons/ri";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiMiniXMark } from "react-icons/hi2";
import { data } from "../../data/data"; 
import { useNavigate } from "react-router-dom";

function Header() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [categoryStack, setCategoryStack] = useState([]);
  const navigate = useNavigate();
  const onClose = () => {
    setShowSidebar(false);
    setCategoryStack([]);
  };

  const handleCategoryClick = (category) => {
    if (category.products && category.products.length > 0) {
      navigate(`/products/${category.slug}`);
      onClose();
    } else if (category.subcategories && category.subcategories.length > 0) {
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
    if (level === 0) return data.categories || [];
    return categoryStack[level - 1]?.subcategories || [];
  };

  return (
    <>
      <aside
        className={`
          fixed inset-0 z-10 bg-black/40
          transition-opacity duration-300 ease-in-out
          ${showSidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      >
        <div
          className={`
            h-full w-[272px] bg-white shadow-md
            transform transition-transform duration-300 ease-in-out
            ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="flex h-[56px] items-center justify-between pl-5 w-full border-b border-[rgb(238,238,237)]">
            {categoryStack.length > 0 ? (
              <button
                onClick={goBack}
                className="text-[16px] flex items-center text-black cursor-pointer"
              >
                <RiArrowLeftLine className="mr-4 text-[20px]" />
                <span>{currentCategory?.name}</span>
              </button>
            ) : (
              <img src="/img/logo.png" alt="logo" className="h-[16px] w-[148px]" />
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
                <div key={level} className="w-full shrink-0 h-full overflow-y-auto">
                  {getCategoriesAtLevel(level).map((category) => (
                    <div
                      key={category.slug}
                      onClick={() => handleCategoryClick(category)}
                      className="h-[61px] px-5 flex items-center justify-between text-[14px] text-black border-b border-[rgb(238,238,237)] cursor-pointer transition-colors "
                    >
                      <span>{category.name}</span>
                      {category.subcategories && category.subcategories.length > 0 && (
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

      <div className="flex h-[56px] items-center pl-2 justify-between mobile:pr-[10px]">
        <button
          className="flex gap-1 items-center"
          onClick={() => setShowSidebar(true)}
        >
          <GiHamburgerMenu />
          <span className="text-[10px]">MENÜ</span>
        </button>
        <div className="flex items-center pl-2">
          <img className="h-[16px] min-w-[148px]" src="/img/logo.png" alt="logo" />
        </div>
        <div className="flex">
          <div className="flex justify-center w-[28px] h-[40px] items-center">
            <IoIosSearch className="h-[18px] w-[18px]" />
          </div>
          <div className="flex justify-center w-[28px] h-[40px] items-center">
            <IoIosHeartEmpty className="h-[15px] w-[15px]" />
          </div>
          <div className="flex justify-center w-[28px] h-[40px] items-center">
            <BsBoxSeam className="scale-x-[-1] h-[15px] w-[15px]" />
          </div>
          <div className="flex justify-center w-[28px] h-[40px] items-center">
            <VscAccount className="h-[15px] w-[15px]" />
          </div>
          <div className="flex justify-center w-[28px] h-[40px] items-center relative">
            <PiBagLight className="h-[15px] w-[15px]" />
            <div className="text-white rounded-full bg-[rgb(94,94,94)] flex items-center justify-center h-[12px] w-[12px] absolute left-4 top-3 text-[10px]">
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;