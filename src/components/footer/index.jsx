import React from 'react'
import { FaLiraSign, FaTruck, FaWallet } from 'react-icons/fa'
import { GiSewingMachine } from 'react-icons/gi'
import { HiRefresh } from 'react-icons/hi'

function Footer() {
  return (
    <>
        <footer>
            <div className='flex'>
                <div className='flex flex-col py-5 items-center justify-center gap-2'>
                    <div className='bg-[#EEEEEE] rounded-full p-2'>
                        <HiRefresh/>
                    </div>
                    <p className='text-[10px] text-center'>Mağazalarımızdan Değişim</p>
                </div>
                <div className='flex flex-col py-5 items-center justify-center gap-2'>
                    <div className='bg-[#EEEEEE] rounded-full p-2'>
                        <FaLiraSign/>
                    </div>
                    <p className='text-[10px] text-center'>Havale İle Ödeme</p>
                </div>
                <div className='flex flex-col py-5 items-center justify-center gap-2'>
                    <div className='bg-[#EEEEEE] rounded-full p-2'>
                        <GiSewingMachine />
                    </div>
                    <p className='text-[10px] text-center'>Ücretsiz Terzi Hizmeti</p>
                </div>
                <div className='flex flex-col py-5 items-center justify-center gap-2'>
                    <div className='bg-[#EEEEEE] rounded-full p-2'>
                        <FaTruck />
                    </div>
                    <p className='text-[10px] text-center'>1500 TL Üstü Kargo Bedava</p>
                </div>
                <div className='flex flex-col py-5 items-center justify-center gap-2'>
                    <div className='bg-[#EEEEEE] rounded-full p-2'>
                        <FaWallet />
                    </div>
                    <p className='text-[10px] text-center'>Kapıda Ödeme</p>
                </div>
            </div>
        </footer>
    </>
  )
}

export default Footer