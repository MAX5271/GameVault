const HappyFace = (props) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="50" cy="50" r="30" fill="#FBBF24" />
    
    <path
      d="M38 45 C 38 45, 40 42, 44 45"
      stroke="#78350F"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M56 45 C 56 45, 58 42, 62 45"
      stroke="#78350F"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M35 55 Q 50 70 65 55"
      stroke="#78350F"
      strokeWidth="3"
      strokeLinecap="round"
    />
    
    <circle cx="35" cy="55" r="3" fill="#FCA5A5" opacity="0.6"/>
    <circle cx="65" cy="55" r="3" fill="#FCA5A5" opacity="0.6"/>
  </svg>
);

export default HappyFace;