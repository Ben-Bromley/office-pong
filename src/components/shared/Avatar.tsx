import Image from 'next/image';
import { FC } from 'react';

interface Props {
  image: string | null | undefined;
  name: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
}

const Avatar: FC<Props> = ({ image, name, size = 48, bgColor = '#f0f0f0', fgColor = '#555555' }) => {
  const firstName = name.split(' ')[0];
  console.log(firstName);
  const displayName = firstName || name;

  if (!image) {
    const initials = name!
      .split(' ')
      .map((word) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <>
        <svg width={size} height={size} viewBox="0 0 100 100" className="rounded-full">
          <rect width="100" height="100" fill={bgColor} />
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="50"
            fill={fgColor}
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {initials}
          </text>
        </svg>
        <span className="text-xs mt-1.5 text-slate-600 truncate w-full text-center">{displayName}</span>
      </>
    );
  }

  return (
    <>
      <Image
        src={image}
        alt={displayName}
        width={size}
        height={size}
        className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
      />
      <span className="text-xs mt-1.5 text-slate-600 truncate w-full text-center">{displayName}</span>
    </>
  );
};

export default Avatar;
