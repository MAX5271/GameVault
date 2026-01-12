import { useNavigate } from "react-router-dom"

function GameCard({imgSrc,gameName,id}) {

    const navigate = useNavigate();

  return (
    <div className="GameCard" onClick={()=>navigate(`/detail/${id}`)} >
      <img src={imgSrc}/>
      <p>{gameName}</p>
    </div>
  )
}

export default GameCard