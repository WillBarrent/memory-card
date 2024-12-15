import { useEffect, useState } from "react";

function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [images, setImages] = useState(null);
  const [clickedImage, setClickedImage] = useState([]);

  useEffect(() => {
    let ignore = false;

    try {
      if (!ignore) {
        (async function () {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20`,
            {
              mode: "cors",
            }
          );
          const data = await response.json();
          const results = data.results;
          const resultImages = [];

          for (let i = 0; i < 6; i++) {
            const response = await fetch(`${results[i].url}`, {
              mode: "cors",
            });
            const data = await response.json();
            resultImages.push({
              id: i,
              imageUrl: data.sprites.other["official-artwork"]["front_default"],
            });
          }

          setImages(resultImages);
        })();
      }
    } catch (e) {
      console.error(e.message);
    }

    return () => {
      ignore = true;
    };
  }, []);

  function handleClick(imageId) {
    if (clickedImage.length == 0) {
      setScore(score + 1);
      setClickedImage([imageId]);
    } else if (clickedImage.length != 0 && !clickedImage.includes(imageId)) {
      setScore(score + 1);

      const imagesId = [...clickedImage];
      imagesId.push(imageId);
      setClickedImage(imagesId);
    } else {
      setBestScore(score > bestScore ? score : bestScore);
      setScore(0);
      setClickedImage([]);
    }

    randomizeImageOrder();
  }

  function randomizeImageOrder() {
    const newOrder = [];
    const newImages = [];
    const imagesId = images.map((image) => image.id);

    for (let i = 0; i < imagesId.length; i++) {
      let generated = false;
      let random;
      while (!generated) {
        random = Math.trunc((Math.random() * 100) % 6);
        if (!newOrder.includes(random)) {
          generated = true;
          newOrder.push(random);
        }
      }

      let image = images.find((img) => img.id == random);
      newImages.push(image);
    }

    setImages(newImages);
  }

  function resetGame() {
    setBestScore(0);
    setScore(0);
    setClickedImage([]);
  }

  return (
    <>
      <div
        className="modal"
        style={{
          display: score == 6 ? "block" : "none",
        }}
      >
        <div className="modal-text">You win!</div>
        <button className="reset" onClick={resetGame}>
          New Game!
        </button>
      </div>
      <div
        className="background"
        style={{
          display: score == 6 ? "block" : "none",
        }}
      ></div>
      <div className="header">
        <div className="title">Memory Card</div>
        <div className="scores">
          <div className="score">Score: {score}</div>
          <div className="best-score">Best Score: {bestScore}</div>
        </div>
      </div>
      {images == null ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="images">
          {images.map((image) => {
            return (
              <div
                className="image-box"
                key={image.id}
                onClick={() => handleClick(image.id)}
              >
                <img src={image.imageUrl} alt="" className="image" />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default App;
