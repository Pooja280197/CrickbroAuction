import React from 'react'
import { Download, Apple } from 'lucide-react'
import appImage from '../../assets/Images/appImage.png'

const Sponsors = () => {
  const sponsors = [
    { category: 'OFFICIAL ENERGY DRINK PARTNER', name: 'Predator', logo: '🐯' },
    { category: 'OFFICIAL OTT PARTNER', name: 'JioHotstar', logo: '📺' },
    { category: 'OFFICIAL BALL PARTNER', name: 'SG Ball', logo: '⚫' },
    { category: 'OFFICIAL ENTERTAINMENT PARTNERS', name: 'Mirchi & Gaana', logo: '🎵' },
    { category: 'OFFICIAL TICKETING PARTNER', name: 'BookMyShow', logo: '🎫' },
    { category: 'OFFICIAL BROADCAST PARTNER', name: 'Star Sports', logo: '⭐' },
    { category: 'OFFICIAL SHOE & APPAREL PARTNER', name: 'Tenx', logo: '👟' },
    { category: 'OFFICIAL RESORT PARTNER', name: 'Resort', logo: '🏨' },
  ]

  return (
    <>
      {/* App Download Section */}
      <div className="relative h-[90vh] py-12 md:py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-header-1) 0%, var(--color-header-2) 100%)' }}>
        
        {/* Decorative Colorful Borders */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Top Right Colorful Stripes */}
          <div className="absolute top-0 right-0 w-96 h-96">
            <div className="absolute inset-0 opacity-30" style={{
              background: 'repeating-linear-gradient(45deg, #FF1744 0px, #FF1744 10px, #00E676 10px, #00E676 20px, #2196F3 20px, #2196F3 30px, #FFEB3B 30px, #FFEB3B 40px)',
              clipPath: 'polygon(0 0, 100% 0, 100% 30%, 30% 100%, 0 100%)'
            }} />
          </div>
          
          {/* Bottom Left Colorful Stripes */}
          <div className="absolute bottom-0 left-0 w-96 h-96">
            <div className="absolute inset-0 opacity-30" style={{
              background: 'repeating-linear-gradient(45deg, #FF1744 0px, #FF1744 10px, #00E676 10px, #00E676 20px, #2196F3 20px, #2196F3 30px, #FFEB3B 30px, #FFEB3B 40px)',
              clipPath: 'polygon(0 70%, 70% 0, 100% 0, 100% 100%, 0 100%)'
            }} />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold"
                style={{ color: 'var(--color-crickbroYellow)' }}>
                APP DOWNLOAD
              </h2>

              <p className="text-base md:text-lg leading-relaxed text-white/90">
                Stay updated with the latest scores on the go! Access exclusive content, including match highlights, press conferences, and recaps, all at your fingertips by downloading the official app.
              </p>

              <p className="text-sm md:text-base text-white/80">
                Available now on both the App Store and Google Play Store.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="https://play.google.com/store/apps/details?id=com.crickbroapp&hl=en_IN" target='_blank' className="flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-black/60 border-2 border-white/30 rounded-lg transition-all transform hover:scale-105 text-white font-semibold">
                  <Download size={20} />
                  <div className="text-left">
                    <div className="text-xs text-white/70">GET IT ON</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </a>

                <a href="https://apps.apple.com/in/app/crickbro-cricket-scoring-app/id6740860359"  target='_blank' className="flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-black/60 border-2 border-white/30 rounded-lg transition-all transform hover:scale-105 text-white font-semibold">
                  <Apple size={20} />
                  <div className="text-left">
                    <div className="text-xs text-white/70">Download on the</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right - Phone Mockup */}
            <div className="relative h-96 md:h-full flex items-center justify-center">
              {/* Colorful Ring Animation */}
              <div className="absolute w-80 h-80 rounded-full opacity-20"
                style={{
                  background: 'conic-gradient(from 0deg, #FF1744 0deg, #FF1744 45deg, #00E676 45deg, #00E676 90deg, #2196F3 90deg, #2196F3 180deg, #FFEB3B 180deg, #FFEB3B 270deg, #FF1744 270deg)',
                  animation: 'spin 20s linear infinite'
                }} />

              {/* Phone Card */}
        
    
                
                  {/* <div className="absolute top-0 left-0 right-0 h-8 bg-black flex items-center justify-between px-6 text-white text-xs z-20">
                    <span>9:41</span>
                    <span>📶</span>
                  </div>

                  <div className="mt-10 w-full h-full flex flex-col items-center justify-center gap-3 text-white text-center px-2">
                    <div className="text-4xl font-bold" style={{ color: 'var(--color-crickbroYellow)' }}>
                      SEASON • 3
                    </div>
                    <div className="text-xs font-semibold text-white/80">
                      REGISTRATIONS OPENS NOW
                    </div>

                    <div className="w-full mt-4 space-y-2">
                      <div className="bg-white/20 rounded-lg h-16 flex items-center justify-center text-xs font-semibold">
                        Highlights
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/20 rounded-lg h-12 flex items-center justify-center text-xs">
                          Match
                        </div>
                        <div className="bg-white/20 rounded-lg h-12 flex items-center justify-center text-xs">
                          News
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src={appImage} alt="App Mockup" className="w-full h-full object-contain" />
                    </div>
               
            
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>

      {/* Sponsors Section */}
      <div className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16"
            style={{ color: 'var(--color-header-1)' }}>
            Sponsors
          </h2>

          {/* Sponsors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {sponsors.map((sponsor, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                {/* Category Label */}
                <p className="text-xs md:text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 line-clamp-2 h-8 md:h-10 flex items-center justify-center">
                  {sponsor.category}
                </p>

                {/* Logo Container */}
                <div className="w-full h-20 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-3 hover:shadow-lg transition-all group-hover:scale-105 border border-gray-200">
                  <div className="text-4xl md:text-5xl opacity-80 group-hover:opacity-100 transition-opacity">
                    {sponsor.logo}
                  </div>
                </div>

                {/* Sponsor Name */}
                <p className="text-xs md:text-sm font-semibold text-gray-700">
                  {sponsor.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
export default Sponsors
