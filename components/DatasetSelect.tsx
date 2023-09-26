import { Dataset } from '@/types/types';
import { FC } from 'react';

interface Props {
  dataset: Dataset;
  onChange: (dataset: Dataset) => void;
}

export const DatasetSelect: FC<Props> = ({ dataset, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as Dataset);
  };

  return (
    <select
      className="h-[40px] w-[260px] rounded-md bg-[#1F2937] px-4 py-2 text-neutral-200"
      value={dataset}
      onChange={handleChange}
    >
      <option value="California Code">California Legal Code</option>
      <option value="Federal Regulation">Federal Regulations</option>
      <option value="MICA Regulations">MICA Regulations</option>
    </select>
  );
};
