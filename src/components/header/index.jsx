import { BsBoxSeam } from "react-icons/bs"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoIosHeartEmpty, IoIosSearch } from "react-icons/io"
import { PiBagLight } from "react-icons/pi"
import { VscAccount } from "react-icons/vsc"

function Header({ onHamburgerClick }) {
  return (
    <>  
       <div className="flex h-[56px] items-center pl-2 justify-between xs:pr-[10px]">
          <div className="flex gap-1" onClick={onHamburgerClick}>
            <div><GiHamburgerMenu/></div>
            <span className="text-[10px]">MENÜ</span>
          </div> 
          <div className="flex items-center pl-2">
            <img className="h-[16px] w-[148px]" src="src/assets/img/logo.png" alt="logo" />
          </div>
          <div className="flex">
            <div className="flex justify-center w-[28px] h-[40px] items-center">
              <IoIosSearch className="h-[18px] w-[18px]"/>
            </div>
            <div className="flex justify-center w-[28px] h-[40px] items-center">
              <IoIosHeartEmpty className="h-[15px] w-[15px]"/>
            </div>
            <div className="flex justify-center w-[28px] h-[40px] items-center">
              <BsBoxSeam className="scale-x-[-1] h-[15px] w-[15px]"/>
            </div>
            <div className="flex justify-center w-[28px] h-[40px] items-center">
              <VscAccount className="h-[15px] w-[15px]"/>
            </div>
            <div className="flex justify-center w-[28px] h-[40px] items-center relative">
              <PiBagLight className="h-[15px] w-[15px]"/>
              <div className="text-white rounded-full bg-[rgb(94,94,94)] flex items-center justify-center h-[12px] w-[12px] absolute left-4 top-3  text-[10px]">
                <span>0</span>
              </div>
            </div>
          </div>
       </div>
    </>
  )
}

export default Header