const NeutralFace = (props) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="50" cy="50" r="30" fill="#FBBF24" />

    <circle cx="40" cy="45" r="4" fill="#78350F" />
    <circle cx="60" cy="45" r="4" fill="#78350F" />

    <line 
      x1="35" y1="65" 
      x2="65" y2="65" 
      stroke="#78350F" 
      strokeWidth="3" 
      strokeLinecap="round" 
    />
  </svg>
);

export default NeutralFace;