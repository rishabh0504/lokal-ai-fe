import Image from 'next/image'
import React, { FC } from 'react'

interface CustomIconProps {
  src: string
  alt?: string
  size?: number
  className?: string
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void
}

const CustomIcon: FC<CustomIconProps> = ({ src, alt = 'icon', size = 24, className, onClick }) => {
  return (
    <Image src={src} alt={alt} width={size} height={size} className={className} onClick={onClick} />
  )
}

export default CustomIcon
