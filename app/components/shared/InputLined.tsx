import React from "react";

type InputLinedProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  id: string;
  label: string;
  textarea?: boolean;
};

export default function InputLined({ textarea, label, ...props }: InputLinedProps) {
  return (
    <React.Fragment>
      <div className="flex flex-col-reverse">
        {textarea ? (
          <textarea
            id={props.id}
            onChange={props.onChange as any}
            value={props.value as string}
            rows={4}
            className="outline-none border-b border-gray-200 w-full peer focus:border-b-brand-500 transition-all hover:border-gray-300 resize-none mt-2"
          ></textarea>
        ) : (
          <input
            {...props}
            className="outline-none border-b border-gray-200 w-full h-[40px] peer focus:border-b-brand-500 transition-all hover:border-gray-300"
            type="text"
          />
        )}
        <label
          className="text-gray-500 text-sm peer-focus:text-brand-500 peer-focus:font-medium transition-all"
          htmlFor={props.id}
        >
          {label}
        </label>
      </div>
    </React.Fragment>
  );
}
