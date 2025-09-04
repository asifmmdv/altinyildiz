// src/pages/ProductDetail.jsx
import React, { useId, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { data } from "../data/data";

// 👉 Swiper (only for ≤768px gallery)
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaRegHeart } from "react-icons/fa";

// -------------------- Utilities --------------------
function findProductById(categories, id, trail = []) {
  for (const category of categories) {
    const nextTrail = [...trail, { name: category.name, slug: category.slug }];

    if (category.products) {
      const match = category.products.find((p) => p.id === id);
      if (match) return { product: match, path: nextTrail };
    }
    if (category.subcategories) {
      const found = findProductById(category.subcategories, id, nextTrail);
      if (found) return found;
    }
  }
  return null;
}

function computeAverageFromReviews(reviews = []) {
  if (!Array.isArray(reviews) || reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  return +(sum / reviews.length).toFixed(1); // 1 decimal
}

function getStarTypes(avg) {
  if (avg == null) return Array(5).fill("empty");
  const types = [];
  for (let i = 1; i <= 5; i++) {
    if (avg >= i) types.push("full");
    else if (avg >= i - 0.5) types.push("half");
    else types.push("empty");
  }
  return types;
}

// -------------------- Star Icons (custom colors) --------------------
const Star = ({ type = "empty", className = "w-4 h-4" }) => {
  const gradId = useId();
  const yellow = "rgb(254 192 0)";
  const gray = "rgb(216 216 216)";
  if (type === "full") {
    return (
      <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill={yellow}>
        <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.62L10 0 7.19 6.62 0 7.24l5.46 4.73L3.82 19 10 15.27z" />
      </svg>
    );
  }
  if (type === "half") {
    return (
      <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor={yellow} />
            <stop offset="50%" stopColor={gray} />
          </linearGradient>
        </defs>
        <path
          d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.62L10 0 7.19 6.62 0 7.24l5.46 4.73L3.82 19 10 15.27z"
          fill={`url(#${gradId})`}
          stroke={gray}
          strokeWidth="0.5"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke={gray}
      strokeWidth="1.5"
    >
      <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.62L10 0 7.19 6.62 0 7.24l5.46 4.73L3.82 19 10 15.27z" />
    </svg>
  );
};

// -------------------- Page --------------------
export default function ProductDetail() {
  const { id } = useParams();
  const found = findProductById(data.categories, id);

  if (!found) {
    return (
      <div className="px-4 py-8 max-w-6xl mx-auto">
        <p className="text-sm text-gray-600">Ürün bulunamadı.</p>
        <Link to="/products" className="text-blue-600 underline mt-2 inline-block">
          Ürünlere geri dön
        </Link>
      </div>
    );
  }

  const { product, path } = found;
  const [activeIndex, setActiveIndex] = useState(0);
  const images = product.images || [];
  const hasVideo = Array.isArray(product.video) && product.video.length > 0;

  // Build media array and put the video at index 1 (second)
  const media = useMemo(() => {
    const base = images.map((src) => ({ type: "image", src }));
    if (hasVideo) {
      const vid = { type: "video", src: product.video[0] };
      base.splice(Math.min(1, base.length), 0, vid); // insert as 2nd item if possible
    }
    return base;
  }, [images, hasVideo, product.video]);

  // Ratings derived from reviews
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const average = useMemo(() => computeAverageFromReviews(reviews), [reviews]);
  const starTypes = getStarTypes(average);
  const reviewsCount = reviews.length;

  // Sort reviews by date (newest first)
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      return db - da;
    });
  }, [reviews]);

  return (
    <div className="w-full max-tablet-lg:max-w-[640px] max-laptop:max-w-[768px] max-desktop:max-w-[984px] mx-auto max-desktop-lg:max-w-[1210px] max-desktop-xl:max-w-[1330px] desktop-xl:max-w-[1430px] pb-[88px] tablet-lg:pb-0">
      {/* breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4 flex px-2 flex-wrap gap-1">
        <Link to="/" className="hover:underline">Anasayfa</Link>
        {path.map((segment) => (
          <React.Fragment key={segment.slug}>
            <span>/</span>
            <Link to={`/products/${segment.slug}`} className="hover:underline">
              {segment.name}
            </Link>
          </React.Fragment>
        ))}
        <span>/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 tablet-lg:grid-cols-2 laptop:gap-5">
        {/* gallery */}
        <div>
          {/* ≤768px: swipeable gallery (video is 2nd slide) */}
          <div className="tablet-lg:hidden">
            {media.length > 0 ? (
              <Swiper
                modules={[Pagination]}
                slidesPerView={1}
                spaceBetween={12}
                pagination={{ clickable: true }}
                onSlideChange={(sw) => setActiveIndex(sw.activeIndex)}
              >
                {media.map((m, idx) => (
                  <SwiperSlide key={(m.type === "image" ? "img-" : "vid-") + idx}>
                    <div className="relative">
                      {m.type === "image" ? (
                        <img
                          src={m.src}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full object-contain bg-white"
                        />
                      ) : (
                        <video
                          src={m.src}
                          controls
                          autoPlay
                          muted
                          playsInline
                          className="w-full object-cover bg-black"
                        />
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="w-full h-[420px] grid place-items-center text-sm text-gray-500">
                Görsel yok
              </div>
            )}
          </div>

          {/* ≥768px: 2-per-row grid with fixed item size (video is 2nd item) */}
          <div className="hidden tablet-lg:block">
            <div className="grid grid-cols-2 gap-3">
              {media.length > 0 ? (
                media.map((m, idx) => (
                  <div
                    key={(m.type === "image" ? "tablet-lg-img-" : "tablet-vid-") + idx}
                    className="tablet-lg:w-[150px] tablet-lg:h-[240px] laptop:w-[221px] laptop:h-[331px] desktop-lg:h-[517px] desktop-lg:w-[325px] overflow-hidden bg-white"
                  >
                    {m.type === "image" ? (
                      <img
                        src={m.src}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover laptop:object-contain"
                      />
                    ) : (
                      <video
                        src={m.src}
                        controls
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover bg-black"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-sm text-gray-500 py-10">Görsel yok</div>
              )}
            </div>
          </div>
        </div>

        {/* info */}
        <div className="flex flex-col gap-2 max-laptop:p-5">
          <h1 className="text-[14px] tablet-lg:text-[18px] font-medium">{product.name}</h1>

          {/* ratings row */}
          <div className="flex items-center gap-2 text-gray-700">
            <div className="flex items-center gap-0.5">
              {starTypes.map((t, i) => (
                <Star key={i} type={t} className="w-4 h-4" />
              ))}
            </div>
            {average != null ? (
              <span className="text-sm">({average}/5)</span>
            ) : (
              <span className="text-sm text-gray-500">Henüz değerlendirme yok</span>
            )}
            {reviewsCount > 0 && (
              <span className="text-xs text-gray-500">• {reviewsCount} değerlendirme</span>
            )}
          </div>

          <div className="text-gray-600 text-sm">Renk: {product.color}</div>

          {/* price (desktop/tablet only) */}
          <div className="hidden tablet-lg:block">
            <div className="text-[black] text-xl font-bold">{product.price}</div>
          </div>

          {product.sizes?.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Beden</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} className="px-3 py-2 border rounded hover:bg-gray-50 text-sm">
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.details?.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Ürün Özellikleri</div>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {product.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {/* add to cart row (desktop/tablet only) */}
          <div className="hidden tablet-lg:flex gap-3 pt-2">
            <button className="flex-1 bg-black text-white rounded-lg px-4 py-3 text-sm font-medium">
              Sepete Ekle
            </button>
            <button className="border rounded-lg px-4 py-3 text-sm font-medium">
              <FaRegHeart />
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-2">Ürün Kodu: {product.id}</div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-10 px-2">
        <h2 className="text-base tablet-lg:text-lg text-center font-semibold mb-4">Değerlendirmeler</h2>
        {reviewsCount === 0 ? (
          <div className="text-sm text-gray-600">Bu ürün için henüz yorum yapılmamış.</div>
        ) : (
          <ul className="space-y-4">
            {sortedReviews.map((rev, idx) => {
              const types = getStarTypes(rev.rating || 0);
              const dateStr = rev.date ? new Date(rev.date).toLocaleDateString("tr-TR") : "";
              return (
                <li key={idx} className="rounded-lg p-4 shadow-lg border-[rgb(238,238,237)]">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{rev.user || "Anonim"}</div>
                    <div className="text-xs text-gray-500">{dateStr}</div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {types.map((t, i) => (
                      <Star key={i} type={t} className="w-4 h-4" />
                    ))}
                    {rev.rating ? (
                      <span className="text-xs text-gray-600 ml-1">{rev.rating}/5</span>
                    ) : null}
                  </div>
                  {rev.comment && (
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">{rev.comment}</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Mobile bottom bar (≤768px) */}
      <div
        className="tablet-lg:hidden fixed inset-x-0 bottom-0 border-t border-[rgb(238,238,237)] shadow-lg shadow-[rgb(0,0,0)] z-50 bor bg-white"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-[640px] px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[12px] text-black leading-none">{product.price}</span>
            </div>
            <button className="ml-auto h-[44px] w-[151px] bg-black text-white rounded-lg px-4 py-3 text-sm  font-medium">
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}