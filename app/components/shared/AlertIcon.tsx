import React from "react";

type AlertIconProps = {
  type: "info" | "warning" | "error" | "success";
};
function AlertIcon({ type }: AlertIconProps) {
  const icon: Record<typeof type, React.ReactElement<any, any>> = {
    info: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1_26473)">
          <path
            d="M10.0013 13.3333V9.99996M10.0013 6.66663H10.0096M18.3346 9.99996C18.3346 14.6023 14.6037 18.3333 10.0013 18.3333C5.39893 18.3333 1.66797 14.6023 1.66797 9.99996C1.66797 5.39759 5.39893 1.66663 10.0013 1.66663C14.6037 1.66663 18.3346 5.39759 18.3346 9.99996Z"
            stroke="#475467"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_26473">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    error: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1_26495)">
          <path
            d="M10.0013 6.66663V9.99996M10.0013 13.3333H10.0096M18.3346 9.99996C18.3346 14.6023 14.6037 18.3333 10.0013 18.3333C5.39893 18.3333 1.66797 14.6023 1.66797 9.99996C1.66797 5.39759 5.39893 1.66663 10.0013 1.66663C14.6037 1.66663 18.3346 5.39759 18.3346 9.99996Z"
            stroke="#D92D20"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_26495">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    success: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.2513 9.99996L8.7513 12.5L13.7513 7.49996M18.3346 9.99996C18.3346 14.6023 14.6037 18.3333 10.0013 18.3333C5.39893 18.3333 1.66797 14.6023 1.66797 9.99996C1.66797 5.39759 5.39893 1.66663 10.0013 1.66663C14.6037 1.66663 18.3346 5.39759 18.3346 9.99996Z"
          stroke="#039855"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    warning: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.99817 7.49995V10.8333M9.99817 14.1666H10.0065M8.84427 3.24305L1.99019 15.0819C1.61002 15.7386 1.41994 16.0669 1.44803 16.3364C1.47254 16.5714 1.59568 16.785 1.78681 16.924C2.00594 17.0833 2.38533 17.0833 3.1441 17.0833H16.8522C17.611 17.0833 17.9904 17.0833 18.2095 16.924C18.4007 16.785 18.5238 16.5714 18.5483 16.3364C18.5764 16.0669 18.3863 15.7386 18.0061 15.0819L11.1521 3.24305C10.7733 2.58875 10.5839 2.26159 10.3368 2.15172C10.1212 2.05587 9.87513 2.05587 9.65959 2.15172C9.41248 2.26159 9.22307 2.58875 8.84427 3.24305Z"
          stroke="#DC6803"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };
  return <>{icon[type]}</>;
}

export default AlertIcon;
