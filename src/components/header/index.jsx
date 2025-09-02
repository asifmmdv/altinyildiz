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
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
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

  // ---- Inline search without flatten/modal ----
  const searchProducts = (root, q) => {
    const text = q.trim().toLowerCase();
    if (!text) return [];

    const out = [];

    const visit = (node, trail = []) => {
      if (!node) return;

      // collect products at this node
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

      // recurse into subcategories
      if (Array.isArray(node.subcategories)) {
        node.subcategories.forEach((child) =>
          visit(child, [...trail, { name: child.name, slug: child.slug }])
        );
      }
    };

    // start from each root category
    (root?.categories || []).forEach((rootCat) => {
      visit(rootCat, [{ name: rootCat.name, slug: rootCat.slug }]);
    });

    // simple ranking: prefer name startsWith
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

  return (
    <>
      {/* Drawer (Sidebar) */}
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
          {/* Search icon toggles inline search bar */}
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
                        // Navigate to your product page by ID (adjust route if needed)
                        navigate(`/product/${item.id}`);
                        // Reset UI
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
                        <div className="text-[14px] font-medium line-clamp-2">
                          {item.name}
                        </div>
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
