import { Mail, Phone, Facebook, Linkedin, Youtube, Instagram, ChevronDown } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/Images/AuctionLogo.png'

const LandingHeader = () => {
  const navigate = useNavigate()
//   const [openDropdown, setOpenDropdown] = useState(null)

  const data = {
    phoneNumber: '02269587007',
    email: "isplit10@ccssports.in"
  }

//  

  const socialLinks = [
    { icon: Facebook, url: '#', label: 'Facebook' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
    { icon: Youtube, url: '#', label: 'YouTube' },
    { icon: Instagram, url: '#', label: 'Instagram' },
  ]

  return (
    <div  className='sticky top-0 z-50'>
      {/* Top Info Bar */}
      <div style={{ backgroundColor: 'var(--color-header-1)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Contact Info */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="flex items-center gap-2" style={{ color: 'var(--color-header-text)' }}>
                <Phone size={18} />
                <span className="text-sm md:text-base font-light">{data.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--color-header-text)' }}>
                <Mail size={18} />
                <span className="text-sm md:text-base font-light">{data.email}</span>
              </div>
            </div>

            {/* Follow Us & Social Icons */}
            <div className="flex items-center gap-3">
              <span style={{ color: 'var(--color-header-text)' }} className="text-sm md:text-base font-light">
                Follow Us
              </span>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      className="p-1 rounded-full transition-all hover:bg-white/10"
                      title={social.label}
                    >
                      <Icon size={18} style={{ color: 'var(--color-header-text)' }} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div style={{ backgroundColor: 'var(--color-header-2)', borderBottom: `1px solid var(--color-header-border)` }} className='backdrop-blur-md' >
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <img src={logo} alt="Logo" className="h-12 md:h-16 w-auto" />
            </div>

            {/* Nav Links - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-6 flex-1">
 
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
             <button className=" px-8 py-2 rounded-lg font-bold text-sm md:text-base transition-all transform hover:scale-105"
              style={{ backgroundColor: 'var(--color-crickbroYellow)', color: '#000' }}>
              REGISTER NOW
            </button>
              
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default LandingHeader
