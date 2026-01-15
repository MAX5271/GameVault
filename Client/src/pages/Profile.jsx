// src/pages/Profile.jsx
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataContext from "../context/DataContext";
import axios from "../api/axios";
import GameCard from "../components/GameCard";
import  Ax from "axios";

function Profile() {
  const { username } = useParams();
  const { user } = useContext(DataContext);
  const apiKey = import.meta.env.VITE_API_KEY;

  const api = Ax.create({
    baseURL: `https://api.rawg.io/api`,
  });

  const [wantToPlay, setWantToPlay] = useState([]);
  useEffect(() => {
    const fetchWTP = async () => {
      const response = await axios.get(`/api/v1/user/${username}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        withCredentials: true,
      });
      console.log(JSON.stringify(response.data.response));
      setWantToPlay(response.data.response.wantToPlay);
    };
    fetchWTP();
  }, []);

  return (
    <div>
      {wantToPlay.map((gameId) => {
          let gameData;
        const fetchGameDetails = async () => {
          
            try {
              const res = await api.get(`games/${gameId}`, {
                params: {
                  key: apiKey,
                }
              });
              if (!res.status) throw new Error("Error while loading the game!");
              gameData = res.data;
            } catch (error) {
              console.log(error.message);
            }
          
            console.log(gameData);
        };
        
        fetchGameDetails();
        //   return <GameCard
        //     key={gameId}
        //     imgSrc={gameData.background_image}
        //     gameName={gameData.name}
        //     id={gameId}
        //   />
      })}
    </div>
  );
}

export default Profile;
