/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/store/theme'
import { RiLayoutRowFill } from 'react-icons/ri'
import { IoGridOutline } from 'react-icons/io5'
import { useStoredImages } from '@/store/stored_images'

interface Props {
  sidebarWidth: number
}

const UploadImages: React.FC<Props> = ({ sidebarWidth }) => {
  const { theme } = useThemeStore()
  const [layout, setLayout] = useState('stacked')
  const [images, setUploadedImages] = useState({})
  const { setImages } = useStoredImages()
  const navigate = useNavigate()

  const remainingWidth = `calc(100vw - ${sidebarWidth}px)`

  const openCtScan = (images) => {
    const imageToData = []
    images.map((image) => {
      const byteString = atob(image.split(',')[1])
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      const blob = new Blob([ab], { type: 'image/jpeg' })
      const url = URL.createObjectURL(blob)
      //eslint-disable-next-line
      //@ts-ignore
      imageToData.push({
        imageName: 'test',
        size: blob.size,
        type: blob.type,
        lastModified: '',
        lastModifiedDate: '',
        path: url,
        imageData: blob, 
        imageTimeframe: '' 
      })
    })
    setImages!(imageToData)
    navigate('/system')
  }

  useEffect(() => {
    const images = localStorage.getItem('images')

    if (images) {
      setUploadedImages(JSON.parse(images))
    }
  }, [])

  return (
    <div
      style={{ width: remainingWidth, transition: 'width 0.3s ease' }}
      className={`h-full ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
    >
      <div className="px-8 pt-10 w-full">
        <div className="flex justify-between items-center">
          <h1 className={`${theme === 'dark' ? 'text-dirty' : 'text-dark'} text-xl`}>Recent</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setLayout('stacked')}
              className={`rounded-full p-2 ${(layout === 'stacked' && 'bg-light_g text-dark') || ''}`}
            >
              <RiLayoutRowFill
                size={20}
                color={layout === 'stacked' ? '#191919' : theme === 'dark' ? '#EFEFEF' : '#191919'}
              />
            </button>
            <button
              onClick={() => setLayout('grid')}
              className={`rounded-full p-2 ${(layout === 'grid' && 'bg-light_g text-dark') || ''}`}
            >
              <IoGridOutline
                size={20}
                color={layout === 'grid' ? '#191919' : theme === 'dark' ? '#EFEFEF' : '#191919'}
              />
            </button>
          </div>
        </div>
        <div
          className={`my-5 pb-4 flex gap-96 items-center border-b ${theme === 'dark' ? 'border-gray_l' : 'border-dark'}`}
        >
          <p className={`${theme === 'dark' ? 'text-zinc-500' : 'text-dark'} font-normal text-md`}>
            Files
          </p>
          <p className={`${theme === 'dark' ? 'text-zinc-500' : 'text-dark'} font-normal text-md`}>
            Recent
          </p>
        </div>
        <div
          className={`${layout === 'stacked' ? 'flex flex-col gap-4' : 'grid grid-cols-5 gap-8'} max-h-[540px] overflow-y-auto customScroll`}
        >
          {Object.keys(images).map((key) => (
            <button
              onClick={() => openCtScan(images[key])}
              key={key}
              className={`${layout === 'stacked' ? 'flex gap-4 items-center border-b pb-4' : 'flex flex-col gap-2'}`}
            >
              <div className="flex gap-2 items-center">
                <img src={images[key][0]} alt={key} className="w-20 h-20" />
                <div className="flex flex-col gap-2 items-start">
                  <h1
                    className={`${theme === 'dark' ? 'text-white' : 'text-dark'} font-regular text-sm`}
                  >
                    {key}
                  </h1>
                  <p className={`${theme === 'dark' ? 'text-dirty' : 'text-dark'} text-xs`}>
                    {images[key].length} {images[key].length > 1 ? 'files' : 'file'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UploadImages
