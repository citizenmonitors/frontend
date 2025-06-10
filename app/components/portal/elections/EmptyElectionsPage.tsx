import { Notepad } from "iconsax-react";
import React from "react";

export default function EmptyElectionsPage() {
  return (
    <div className="w-full grid place-items-center py-16">
      <Notepad size={64} variant="TwoTone" className="text-brand-600" />
      <h3 className="font-league font-medium text-center text-gray-500 mt-1">
        No Elections Here.
      </h3>
    </div>
  );
}
