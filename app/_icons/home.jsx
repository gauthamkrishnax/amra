export default function HomeIcon(props) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M6.811 2.576 0.989 7.671c-.5.437-.165 1.213.523 1.213.42 0 .76.315.76.703v3.244c0 2.79 0 4.185.94 5.052.938.867 2.449.867 5.47.867h2.136c3.021 0 4.532 0 5.47-.867.938-.867.938-2.262.938-5.052V9.587c0-.389.341-.704.762-.704.687 0 1.022-.776.522-1.213l-5.823-5.095C11.297 1.359 10.601.75 9.75.75c-.851 0-1.546.609-2.938 1.826Z"
        stroke="#2F2E41"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={9.75} cy={13.75} r={1} fill="#2F2E41" />
    </svg>
  );
}
