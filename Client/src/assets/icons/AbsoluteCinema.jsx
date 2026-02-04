const AbsoluteCinema = (props) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="50" cy="50" r="30" fill="#FBBF24" />

    <circle cx="40" cy="45" r="4" fill="#78350F" />
    <circle cx="60" cy="45" r="4" fill="#78350F" />

    <path
      d="M40 58 Q 50 68 60 58 Z"
      fill="#78350F"
    />

    <path
      transform="rotate(-30 25 80)"
      d="M20 65 C 20 55, 30 55, 30 65 L 30 80 C 30 85, 20 85, 20 80 Z"
      fill="#FBBF24"
      stroke="#F59E0B"
      strokeWidth="2"
    />

    <path
      transform="rotate(30 75 80)"
      d="M70 65 C 70 55, 80 55, 80 65 L 80 80 C 80 85, 70 85, 70 80 Z"
      fill="#FBBF24"
      stroke="#F59E0B"
      strokeWidth="2"
    />
  </svg>
);

export default AbsoluteCinema;