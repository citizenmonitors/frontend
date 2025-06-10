import React from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  options: SelectOption[];
  placeholder?: string;
  noPlaceholder?: boolean;
};

export default function AppSelect({
  noPlaceholder,
  placeholder,
  options,
  ...props
}: SelectProps) {
  return (
    <select
      className="h-[40px] w-full px-3 rounded-lg bg-white border border-gray-300 hover:border-brand-500 ring-0 focus-within:ring-2 ring-brand-600/25 transition-all cursor-pointer disabled:bg-gray-100 disabled:pointer-events-none disabled:border-gray-300 text-sm"
      {...props}
    >
      {!noPlaceholder && <option value={""}>{placeholder || "--"}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
