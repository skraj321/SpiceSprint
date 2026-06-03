import React from 'react'
import hero from "../assets/hero.png";

const Hero = () => {
  return (
      <div
        className="bg-cover bg-center h-[45vh] md:h-[50vh] rounded-2xl w-full "
        style={{ backgroundImage: `url(${hero})` }}
      >
        {/* Overlay */}
     <div className="bg-black/40 h-full flex items-center rounded-2xl ">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14 gap-5">
            <div className="max-w-xl text-white">
              <h1
                className="text-2xl md:text-5xl font-bold opacity-0 animate-[fadeUp_0.8s_ease_forwards]"
                style={{
                  animationDelay: "0.2s",
                }}
              >
                The Best
              </h1>

              <h1
                className="text-2xl md:text-5xl font-bold opacity-0 animate-[fadeUp_0.8s_ease_forwards]"
                style={{
                  animationDelay: "0.5s",
                }}
              >
                Food Services
              </h1>

              <h1
                className="text-2xl md:text-5xl font-bold text-yellow-500 opacity-0 animate-[fadeUp_0.8s_ease_forwards]"
                style={{
                  animationDelay: "0.8s",
                }}
              >
                in Your City
              </h1>

              <p
                className="text-lg md:text-xl mt-6 text-orange-100 font-serif opacity-0 animate-[fadeUp_0.8s_ease_forwards]"
                style={{
                  animationDelay: "1.1s",
                }}
              >
                We ensure fresh, high-quality food delivered quickly and
                reliably to your doorstep.
              </p>

              <div
                className="mt-8 opacity-0 animate-[fadeUp_0.8s_ease_forwards]"
                style={{
                  animationDelay: "1.4s",
                }}
              >
                
                  <button
                    className="text-lg px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-red-400 hover:text-black transition cursor-pointer"
                    onClick={() => navigate("/menu")}
                  >
                    Explore Now
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Hero
