import { FC, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

type Props = {
  title: string;
  children: React.ReactNode;
  color: string | undefined;
};



const CollapsibleSection: FC<Props> = ({ title, children, color }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-2">
      <button
        className={clsx(
          'flex items-center justify-between w-full px-4 py-2 font-semibold rounded text-white',
          'bg-gradient-to-r',
          color
        )}
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {open && <ul className="pl-2">{children}</ul>}
    </div>
  );
};

export default CollapsibleSection;