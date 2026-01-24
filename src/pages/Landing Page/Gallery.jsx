import one from '../../assets/Images/one.jpg'
import two from '../../assets/Images/two.jpg'
import three from '../../assets/Images/three.jpg'

const images1 = [one, two, three];
const images2 = [three,one, two];
const images3 = [one, two, three];


export default function ImageColumns() {
  return (
    <div className="flex gap-6 justify-between h-[500px] overflow-hidden w-full">
      
      {/* Column 1 – UP */}
      <div className="flex flex-col gap-6 animate-moveUp hover:[animation-play-state:paused]">
        {[...images1, ...images1].map((src, i) => (
          <img
            key={i}
            src={src}
            className="w-48 h-64 object-cover rounded-xl"
          />
        ))}
      </div>

      {/* Column 2 – DOWN */}
      <div className="flex flex-col gap-6 animate-moveDown hover:[animation-play-state:paused]">
        {[...images2, ...images2].map((src, i) => (
          <img
            key={i}
            src={src}
            className="w-48 h-64 object-cover rounded-xl"
          />
        ))}
      </div>

      {/* Column 3 – UP */}
      <div className="flex flex-col gap-6 animate-moveUp hover:[animation-play-state:paused]">
        {[...images3, ...images3].map((src, i) => (
          <img
            key={i}
            src={src}
            className="w-48 h-64 object-cover rounded-xl"
          />
        ))}
      </div>

    </div>
  );
}
