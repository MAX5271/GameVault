import { useNavigate } from "react-router-dom"

function GameCard({imgSrc,gameName,id}) {

    const navigate = useNavigate();
    console.log(imgSrc,gameName,id)

  return (
    <div className="GameCard" onClick={()=>navigate(`/detail/${id}`)} >
      <img src={imgSrc}/>
      <p>{gameName}</p>
    </div>
  )
}

export default GameCard