// src/components/header.jsx
import React, { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosSearch } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { RiArrowLeftLine } from "react-icons/ri";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiMiniXMark } from "react-icons/hi2";
import { useNavigate, Link } from "react-router-dom";
import { data } from "../../data/data";

// ❤️ Wishlist
import { useWishlist } from "../../context/WishlistContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";

// 🧺 Basket
import { useBasket } from "../../context/BasketContext";
import { IoBagOutline } from "react-icons/io5";

function Header() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [categoryStack, setCategoryStack] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showRowMenu, setShowRowMenu] = useState(true);

  const navigate = useNavigate();

  // ❤️ get wishlist count
  const { count } = useWishlist();

  // 🧺 get basket count
  const { count: basketCount } = useBasket();

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

  // ---- Inline search ----
  const searchProducts = (root, q) => {
    const text = q.trim().toLowerCase();
    if (!text) return [];

    const out = [];

    const visit = (node, trail = []) => {
      if (!node) return;

      if (Array.isArray(node.products)) {
        node.products.forEach((p) => {
          const hay = [
            p.name,
            p.color,
            ...(Array.isArray(p.details) ? p.details : []),
            ...trail.map((t) => t.name),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (hay.includes(text)) {
            out.push({
              ...p,
              _breadcrumbs: trail.map((t) => t.name).join(" › "),
            });
          }
        });
      }

      if (Array.isArray(node.subcategories)) {
        node.subcategories.forEach((child) =>
          visit(child, [...trail, { name: child.name, slug: child.slug }])
        );
      }
    };

    (root?.categories || []).forEach((rootCat) => {
      visit(rootCat, [{ name: rootCat.name, slug: rootCat.slug }]);
    });

    out.sort((a, b) => {
      const aName = (a.name || "").toLowerCase();
      const bName = (b.name || "").toLowerCase();
      const aBoost = aName.startsWith(text) ? 1 : 0;
      const bBoost = bName.startsWith(text) ? 1 : 0;
      return bBoost - aBoost;
    });

    return out.slice(0, 30);
  };

  const onSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      return;
    }
    setResults(searchProducts(data, val));
  };

  // row menu hide/show
  useEffect(() => {
    let lastY = window.scrollY;
    window.onscroll = () => {
      const y = window.scrollY;

      if (y <= 16) {
        setShowRowMenu(true);
      } else if (y > lastY) {
        setShowRowMenu(false);
      } else if (y < lastY) {
        setShowRowMenu(true);
      }

      lastY = y;
    };
    return () => {
      window.onscroll = null;
    };
  }, []);

  return (
    <>
      {/* Drawer (Sidebar) */}
      <aside
        className={`
          fixed inset-0 z-999 bg-black/40
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

          {/* Drawer Body */}
          <div className="relative w-full h-full overflow-hidden">
            <div
              className="flex h-full w-full transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentLevel * 100}%)` }}
            >
              {[...Array(currentLevel + 1)].map((_, level) => (
                <div key={level} className="w-full shrink-0 h-full overflow-y-auto">
                  {getCategoriesAtLevel(level).map((category) => (
                    <div
                      key={category.slug || category.name}
                      onClick={() => handleCategoryClick(category)}
                      className="h-[61px] px-5 flex items-center justify-between text-[14px] text-black border-b border-[rgb(238,238,237)] cursor-pointer transition-colors"
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

      {/* Top Bar */}
      <div className="flex tablet:justify-center sticky top-0 z-99 bg-white">
        <div className="flex h-[56px] laptop:h-[100px] max-tablet-lg:max-w=[640px] max-laptop:max-w-[768px] max-desktop:max-w-[984px] max-desktop-lg:max-w-[1240px] max-desktop-xl:max-w-[1360px] desktop-xl:max-w-[1460px] items-center pl-2 justify-between w-full mobile:pr-[10px] transition-all duration-500 ease-in-out">
          <button
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => setShowSidebar(true)}
          >
            <GiHamburgerMenu />
            <span className="text-[10px] desktop:text-[12px]">MENÜ</span>
          </button>

          <div className="flex items-center max-laptop:pl-2 max-laptop:mr-auto justify-center laptop:mx-auto">
            <img
              className="h-[16px] min-w-[148px] laptop:h-[38px] laptop:w-[310px] cursor-pointer"
              src="/img/logo.png"
              alt="logo"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="flex items-center laptop:gap-1">
            {/* Search */}
            <div
              className="flex justify-center w-[28px] h-[40px] items-center cursor-pointer"
              onClick={() => {
                const next = !showSearchBar;
                setShowSearchBar(next);
                if (!next) {
                  setQuery("");
                  setResults([]);
                }
              }}
              aria-label="Ara"
              role="button"
            >
              <IoIosSearch className="h-[18px] w-[18px] laptop:h-[24px] laptop:w-[24px]" />
            </div>

            {/* ❤️ Wishlist */}
            <Link to="/wishlist" className="flex justify-center w-[28px] h-[40px] items-center relative">
              {count > 0 ? (
                <FaHeart className="h-[16px] w-[16px] text-red-500 laptop:h-[20px] laptop:w-[20px]" />
              ) : (
                <FaRegHeart className="h-[14px] w-[14px] laptop:h-[18px] laptop:w-[18px]" />
              )}
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white rounded-full text-[10px] h-4 w-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {/* Account */}
            <div className="flex justify-center w-[28px] h-[40px] items-center">
              <VscAccount className="h-[15px] w-[15px] laptop:h-[20px] laptop:w-[20px]" />
            </div>

            {/* 🧺 Basket (opens /basket, shows live count) */}
            <Link
              to="/basket"
              className="flex justify-center w-[28px] h-[40px] items-center relative"
              aria-label="Sepet"
            >
              <IoBagOutline  className="h-[18px] w-[18px] laptop:h-[24px] laptop:w-[24px]" />
              {basketCount > 0 && (
               <span className="absolute -top-1 -right-1 bg-black text-white rounded-full text-[10px] h-4 w-4 flex items-center justify-center">
               {basketCount}
              </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Row Menu (desktop only) */}
      <div
        className={`
          hidden lg:flex w-full justify-center items-center bg-white h-[72px] pt-2 sticky top-0 z-40
          transition-all duration-500 ease-in-out
          ${showRowMenu ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <div className="max-w-[1240px] mx-auto flex px-4 py-3 text-[12px] font-medium text-[rgb(91,91,91)]">
          <button onClick={() => navigate("/products/takim-elbise")} className="hover:text-black border-r px-4 border-[black] cursor-pointer">
            Takım Elbise
          </button>
          <button onClick={() => navigate("/products/gomlek")} className="hover:text-black border-r px-4 border-[black] cursor-pointer">
            Gömlek
          </button>
          <button onClick={() => navigate("/products/triko-tisort")} className="hover:text-black border-r px-4 border-[black] cursor-pointer">
            Triko Tişört
          </button>
          <button onClick={() => navigate("/products/polo-yaka-tisort")} className="hover:text-black border-r px-4 border-[black] cursor-pointer">
            Polo Yaka Tişört
          </button>
          <button onClick={() => navigate("/products/pantolon")} className="hover:text-black border-r px-4 border-[black] cursor-pointer">
            Pantolon
          </button>
          <button onClick={() => navigate("/products/jean")} className="hover:text-black border-r px-4 border-[black] cursor-pointer">
            Jean
          </button>
          <button onClick={() => navigate("/products/canta")} className="hover:text-black border-r px-4 border-[black] cursor-pointer">
            Çanta
          </button>
          <button onClick={() => navigate("/products/sweatshirt")} className="hover:text-black px-4 cursor-pointer">
            Sweatshirt
          </button>
        </div>
      </div>

      {/* Inline Search Bar + Results */}
      {showSearchBar && (
        <div className="border-t border-[rgb(238,238,237)] px-2 py-2 bg-white">
          <div className="max-w-[960px] mx-auto">
            <input
              value={query}
              onChange={onSearchChange}
              placeholder="Ürün ara (örn. 'lacivert ceket', 'polo tişört', 'takım elbise')"
              className="w-full h-10 px-3 rounded-lg border outline-none text-[14px]"
            />

            {query.trim() && (
              <div className="mt-2 max-h-[60vh] overflow-y-auto border rounded-lg">
                {results.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">Sonuç bulunamadı.</div>
                ) : (
                  results.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(`/product/${item.id}`);
                        setShowSearchBar(false);
                        setQuery("");
                        setResults([]);
                        setShowSidebar(false);
                        setCategoryStack([]);
                      }}
                      className="w-full text-left p-3 border-b last:border-b-0 hover:bg-gray-50 flex gap-3"
                    >
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded-md border"
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] text-gray-500 truncate">
                          {item._breadcrumbs}
                        </div>
                        <div className="text-[14px] font-medium line-clamp-2">{item.name}</div>
                        <div className="text-[12px] text-gray-600 mt-1">
                          {(item.color || "").trim()} • {(item.price || "").trim()}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;