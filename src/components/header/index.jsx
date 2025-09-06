// src/components/header.jsx
import React, { useState, useEffect, useCallback } from "react";
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

const ROW_LINKS = [
  { slug: "takim-elbise", label: "Takım Elbise" },
  { slug: "gomlek", label: "Gömlek" },
  { slug: "triko-tisort", label: "Triko Tişört" },
  { slug: "polo-yaka-tisort", label: "Polo Yaka Tişört" },
  { slug: "pantolon", label: "Pantolon" },
  { slug: "jean", label: "Jean" },
  { slug: "canta", label: "Çanta" },
  { slug: "sweatshirt", label: "Sweatshirt" },
];

function Header() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [categoryStack, setCategoryStack] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showRowMenu, setShowRowMenu] = useState(true);

  const navigate = useNavigate();
  const { count } = useWishlist();            // ❤️ wishlist count
  const { count: basketCount } = useBasket(); // 🧺 basket count

  const onClose = () => {
    setShowSidebar(false);
    setCategoryStack([]);
  };

  const handleCategoryClick = (cat) => {
    if (cat.products?.length) {
      navigate(`/products/${cat.slug}`);
      onClose();
    } else if (cat.subcategories?.length) {
      setCategoryStack((s) => [...s, cat]);
    } else {
      onClose();
    }
  };

  const goBack = () => setCategoryStack((s) => s.slice(0, -1));

  const level = categoryStack.length;
  const currentCategory = categoryStack[level - 1];
  const getLevelCats = (lv) => (lv === 0 ? data.categories || [] : categoryStack[lv - 1]?.subcategories || []);

  // ---- Inline search ----
  const searchProducts = useCallback((root, q) => {
    const text = q.trim().toLowerCase();
    if (!text) return [];
    const out = [];

    const visit = (node, trail = []) => {
      if (!node) return;

      node.products?.forEach((p) => {
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
          out.push({ ...p, _breadcrumbs: trail.map((t) => t.name).join(" › ") });
        }
      });

      node.subcategories?.forEach((child) => visit(child, [...trail, { name: child.name, slug: child.slug }]));
    };

    (root?.categories || []).forEach((rootCat) => visit(rootCat, [{ name: rootCat.name, slug: rootCat.slug }]));

    out.sort((a, b) => {
      const A = (a.name || "").toLowerCase();
      const B = (b.name || "").toLowerCase();
      return (B.startsWith(text) ? 1 : 0) - (A.startsWith(text) ? 1 : 0);
    });

    return out.slice(0, 30);
  }, []);

  const onSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setResults(val.trim() ? searchProducts(data, val) : []);
  };

  const toggleSearch = () => {
    setShowSearchBar((prev) => {
      const next = !prev;
      if (!next) {
        setQuery("");
        setResults([]);
      }
      return next;
    });
  };

  // row menu hide/show on scroll
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 16) setShowRowMenu(true);
      else if (y > lastY) setShowRowMenu(false);
      else if (y < lastY) setShowRowMenu(true);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Drawer (Sidebar) */}
      <aside
        className={`fixed inset-0 z-999 bg-black/40 transition-opacity duration-300 ease-in-out ${
          showSidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div
          className={`h-full w-[272px] bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="flex h-[56px] items-center justify-between pl-5 w-full border-b border-[rgb(238,238,237)]">
            {categoryStack.length ? (
              <button onClick={goBack} className="text-[16px] flex items-center text-black cursor-pointer">
                <RiArrowLeftLine className="mr-4 text-[20px]" />
                <span>{currentCategory?.name}</span>
              </button>
            ) : (
              <img src="/img/logo.png" alt="logo" className="h-[16px] w-[148px]" />
            )}
            <button onClick={onClose} className="flex h-[56px] w-[52px] items-center justify-center cursor-pointer">
              <HiMiniXMark className="text-[22px] text-black" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="relative w-full h-full overflow-hidden">
            <div
              className="flex h-full w-full transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${level * 100}%)` }}
            >
              {[...Array(level + 1)].map((_, lv) => (
                <div key={lv} className="w-full shrink-0 h-full overflow-y-auto">
                  {getLevelCats(lv).map((cat) => (
                    <div
                      key={cat.slug || cat.name}
                      onClick={() => handleCategoryClick(cat)}
                      className="h-[61px] px-5 flex items-center justify-between text-[14px] text-black border-b border-[rgb(238,238,237)] cursor-pointer transition-colors"
                    >
                      <span>{cat.name}</span>
                      {cat.subcategories?.length > 0 && <MdOutlineKeyboardArrowRight className="text-xl" />}
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
          <button className="flex gap-1 items-center cursor-pointer" onClick={() => setShowSidebar(true)}>
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
            <button
              className="flex justify-center w-[28px] h-[40px] items-center cursor-pointer"
              onClick={toggleSearch}
              aria-label="Ara"
            >
              <IoIosSearch className="h-[18px] w-[18px] laptop:h-[24px] laptop:w-[24px]" />
            </button>

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

            {/* 🧺 Basket */}
            <Link to="/basket" className="flex justify-center w-[28px] h-[40px] items-center relative" aria-label="Sepet">
              <IoBagOutline className="h-[18px] w-[18px] laptop:h-[24px] laptop:w-[24px]" />
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
        className={`hidden lg:flex w-full justify-center items-center bg-white h-[72px] pt-2 sticky top-0 z-40 transition-all duration-500 ease-in-out ${
          showRowMenu ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-[1240px] mx-auto flex px-4 py-3 text-[12px] font-medium text-[rgb(91,91,91)]">
          {ROW_LINKS.map(({ slug, label }, i) => (
            <button
              key={slug}
              onClick={() => navigate(`/products/${slug}`)}
              className={`hover:text-black px-4 cursor-pointer ${i < ROW_LINKS.length - 1 ? "border-r border-[black]" : ""}`}
            >
              {label}
            </button>
          ))}
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
                        onClose();
                      }}
                      className="w-full text-left p-3 border-b last:border-b-0 hover:bg-gray-50 flex gap-3"
                    >
                      <img src={item.images?.[0]} alt={item.name} className="h-16 w-16 object-cover rounded-md border" />
                      <div className="min-w-0">
                        <div className="text-[11px] text-gray-500 truncate">{item._breadcrumbs}</div>
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