import { useNavigate } from "react-router-dom";

function Header({ title }) {

    const navigate = useNavigate();

  return (
    <header className="Header" onClick={()=>navigate('/')}>
      <h1>{title}</h1>
    </header>
  );
}

export default Header;
