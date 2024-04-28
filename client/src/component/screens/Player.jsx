import ReactPlayer from "react-player";

const Player = (props) => {
  const { url, muted, playing, toggle, } = props;
console.log(toggle)
  return (
    <div className="bg-yellow-500">
         { !toggle ? (
        <ReactPlayer
      
          url={url}
          muted={muted}
          playing={playing}
          toggle={toggle}
          style={{ transform: 'scaleX(-1)' }}
        
        />
      ) : (
        <div>
               <ReactPlayer
       style={{ display: 'none' }}
          url={url}
          muted={muted}
          playing={playing}
          toggle={toggle}
         
        />
          <img src="https://i.ibb.co/G7b1pnb/blank-avatar-photo-place-holder-600nw-1095249842.webp"/>
          </div>
      )}
    </div>
  );
};

export default Player;