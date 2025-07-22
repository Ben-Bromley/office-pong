import clsx from "clsx";
import { FC } from "react";

interface ScoreInputProps {
  value: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
  hasError?: boolean;
}

const ScoreInput: FC<ScoreInputProps> = ({ value, onChange, disabled, hasError }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <button
        type="button"
        className="text-xs w-10 h-6 bg-slate-100 hover:bg-slate-200 rounded-sm disabled:opacity-40"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        disabled={disabled}
        className={clsx(
          'text-center w-12 h-8 text-sm rounded-sm border px-1 py-1',
          hasError ? 'border-red-500' : 'border-slate-300'
        )}
      />
      <button
        type="button"
        className="text-xs w-10 h-6 bg-slate-100 hover:bg-slate-200 rounded-sm disabled:opacity-40"
        disabled={disabled || value === 0}
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        –
      </button>
    </div>
  );
};

export default ScoreInput;