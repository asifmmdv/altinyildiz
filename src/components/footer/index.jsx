import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaLiraSign, FaTiktok, FaTruck, FaWallet, FaYoutube } from "react-icons/fa";
import { GiSewingMachine } from "react-icons/gi";
import { HiRefresh } from "react-icons/hi";
import { RiTwitterXFill } from "react-icons/ri";

const footerData = {
  "BİLGİ": [
    "Hakkımızda",
    "Kurumsal Web Sitesi",
    "Bayilik Başvuru",
    "Kişisel Verilerin Korunması Politikası",
    "Sürdürülebilirlik",
  ],
  "Genel": [
    "Ödeme",
    "Mağazalar",
    "Kampanyalar",
    "Mağaza Kampanyaları",
    "Kurumsal Satış",
  ],
  "Yardım": [
    "Sıkça Sorulan Sorular / İşlem Rehberi",
    "İade ve Değişim Şartları",
    "Sipariş Takibi",
    "Güvenli Alışveriş",
  ],
  "Özel Sayfalar": [
    "Burak Özçivit",
    "Babalar Günü",
    "Yeni Sezon",
    "Damat Bohçası",
    "Mezuniyet Stili",
  ],
  "Müşteri Hizmetleri": [
    "0 (850) 455 56 57",
    "destek@altinyildizclassics.com",
    "Çalışma Saatleri",
    "Hafta İçi 08:00 - 17:20",
    "İletişim",
  ],
};

function Footer() {
  const [open, setOpen] = useState(null);
  const toggle = (name) => setOpen((prev) => (prev === name ? null : name));

  return (
    <footer className="w-full mt-10 max-tablet-lg:max-w-[640px] max-laptop:max-w-[768px] max-desktop:max-w-[984px] mx-auto max-desktop-lg:max-w-[1210px] max-desktop-xl:max-w-[1330px] desktop-xl:max-w-[1430px]">
      <div className='flex w-full justify-center gap-1 tablet:gap-8 tablet-lg:gap-10 laptop:gap-14 border-t border-[rgb(238,238,237)] laptop:border-b'>
        <div className='flex flex-col desktop:flex-row py-5 items-center justify-center gap-2'>
            <div className='bg-[#EEEEEE] rounded-full p-2'>
                <HiRefresh className="tablet:w-[20px] tablet:h-[20px] desktop:hover:h-[24px] desktop:hover:w-[24px]"/>
            </div>
            <p className='text-[10px] text-center desktop:text-[16px]'>Mağazalarımızdan Değişim</p>
        </div>
        <div className='flex flex-col py-5 items-center desktop:flex-row justify-center gap-2'>
            <div className='bg-[#EEEEEE] rounded-full p-2'>
                <FaLiraSign className="tablet:w-[20px] tablet:h-[20px]"/>
            </div>
            <p className='text-[10px] text-center desktop:text-[16px]'>Havale İle Ödeme</p>
        </div>
        <div className='flex flex-col py-5 items-center desktop:flex-row justify-center gap-2'>
            <div className='bg-[#EEEEEE] rounded-full p-2'>
                <GiSewingMachine className="tablet:w-[20px] tablet:h-[20px]"/>
            </div>
            <p className='text-[10px] text-center desktop:text-[16px]'>Ücretsiz Terzi Hizmeti</p>
        </div>
        <div className='flex flex-col py-5 items-center desktop:flex-row justify-center gap-2'>
            <div className='bg-[#EEEEEE] rounded-full p-2'>
                <FaTruck className="tablet:w-[20px] tablet:h-[20px] "/>
            </div>
            <p className='text-[10px] text-center desktop:text-[16px]'>1500 TL Üstü Kargo Bedava</p>
        </div>
        <div className='flex flex-col py-5 items-center desktop:flex-row justify-center gap-2'>
            <div className='bg-[#EEEEEE] rounded-full p-2'>
                <FaWallet className="tablet:w-[20px] tablet:h-[20px]"/>
            </div>
            <p className='text-[10px] text-center desktop:text-[16px]'>Kapıda Ödeme</p>
        </div>
      </div>
      <div className="w-full mx-auto tablet:mt-10 ">
        <div className="hidden laptop:grid lg:grid-cols-5 gap-6">
          {Object.entries(footerData).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold mb-3">
                {section.replace(/_/g, " ")}
              </h3>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i}>
                    <a
                      className="text-sm text-gray-600 hover:text-black transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="laptop:hidden">
        {Object.entries(footerData).map(([section, items]) => {
            const isOpen = open === section;
            return (
            <div key={section} className="overflow-hidden">
                <button
                type="button"
                className="w-full flex items-center uppercase justify-between p-5 border-[rgb(238,238,237)] border-t-1 border-b-1"
                onClick={() => toggle(section)}
                aria-expanded={isOpen}
                >
                <span className="text-[16px]">
                    {section.replace(/_/g, " ")}
                </span>
                <span className="relative w-4 h-4 flex items-center justify-center">
                    <span
                    className={`absolute transition-all duration-200 transform ${
                        isOpen ? "opacity-0 scale-50" : "opacity-100 scale-100"
                    }`}
                    >
                    +
                    </span>
                    <span
                    className={`absolute transition-all duration-200 transform ${
                        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }`}
                    >
                    −
                    </span>
                </span>
                </button>
                <div
                className={`transition-all duration-300 ease-in-out origin-top ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
                >
                <ul className="pb-3 px-5">
                    {items.map((item, i) => (
                        <li
                        key={i}
                        className="border-b border-[rgb(238,238,237)] last:border-b-0"
                        >
                        <a className="block text-[14px] py-5 transition">
                            {item}
                        </a>
                        </li>
                    ))}
                </ul>
                </div>
            </div>
            );
        })}
        </div>
      </div>
      <div className="max-tablet:bg-[#EEEEEE] max-laptop:px-5 h-[57px] laptop:mt-10 w-full flex items-center laptop:border-t border-[rgb(238,238,237)]">
        <p className="text-[13px] laptop:text-[16px] leading-none">Güvenli Ödeme</p>
        <div className="ml-auto flex items-center gap-[8px] tablet:gap-2 h-[12px] tablet:h-[18px] laptop:h-[22px] flex-none">
          <img className="block h-full w-auto" src="https://images.altinyildizclassics.com/assets/mastercard.png" alt="mstrc" />
          <img className="block h-full w-auto" src="https://images.altinyildizclassics.com/assets/visa.png" alt="visa" />
          <img className="block h-full w-auto" src="https://images.altinyildizclassics.com/assets/troy.svg" alt="troy" />
          <img className="block h-full w-auto" src="https://images.altinyildizclassics.com/assets/bkmexpress.png" alt="xpres" />
          <img className="block h-full w-auto" src="https://images.altinyildizclassics.com/assets/pcilogo2.png" alt="pci" />
        </div>
      </div>
      <div className="flex flex-col laptop:flex-row laptop:justify-between py-5 max-laptop:px-5 gap-5  border-b border-t border-[rgb(238,238,237)]">
        <div className="flex gap-2 justify-center">
            <div className="rounded-full border-1 p-2">
                <FaInstagram />
            </div>
            <div className="rounded-full border-1 p-2">
                <FaFacebookF />
            </div>
            <div className="rounded-full border-1 p-2">
                <RiTwitterXFill />
            </div>
            <div className="rounded-full border-1 p-2">
                <FaYoutube />
            </div>
            <div className="rounded-full border-1 p-2">
                <FaTiktok />
            </div>
        </div>
        <div className="flex flex-row h-[30px] gap-1 justify-center">
            <img className="w-[95px] laptop:w-[120px]" src="https://images.altinyildizclassics.com/assets/google-play.svg" alt="gply" />
            <img className="w-[95px] laptop:w-[120px]" src="https://images.altinyildizclassics.com/assets/app-store.svg" alt="apst" />
            <img className="w-[95px] laptop:w-[120px]" src="https://images.altinyildizclassics.com/assets/app-gallery.svg" alt="appg" />
        </div>
     </div>
        <div className="flex flex-col justify-center laptop:flex-row laptop:justify-between items-center py-5 gap-3">
        <span className="text-xs lg:text-base">
        © {new Date().getFullYear()} Altınyıldız Classics, Tüm hakları saklıdır.
        </span>
            <ul className="flex items-center space-x-6">
            <li>
                <img
                src="https://images.altinyildizclassics.com/assets/logo-brmagazacilik.png"
                className="h-8"
                alt=""
                />
            </li>
            <li>
                <img
                src="https://images.altinyildizclassics.com/assets/boyner-group.svg"
                className="h-6"
                alt=""
                />
            </li>
            </ul>
        </div>
    </footer>
  );
}

export default Footer;