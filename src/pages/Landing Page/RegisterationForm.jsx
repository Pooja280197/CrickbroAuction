import React, { useState } from 'react'
import { ChevronRight, User, CreditCard, Lock, MapPin, Phone, Mail, Check } from 'lucide-react'

const RegisterationForm = () => {
  const [currentStep, setCurrentStep] = useState('details')
  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    mobileNumber: '',
    state: '',
    city: '',
    email: '',
    password: '',
    confirmPassword: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    agreeTerms: false
  })

  const steps = [
    { id: 'details', label: 'Details', icon: User },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'account', label: 'Account', icon: Lock }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNextStep = () => {
    const stepOrder = ['details', 'payment', 'account']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const handlePrevStep = () => {
    const stepOrder = ['details', 'payment', 'account']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const isStepComplete = (step) => {
    if (step === 'details') return formData.fullName && formData.mobileNumber && formData.state && formData.city
    if (step === 'payment') return formData.cardName && formData.cardNumber && formData.expiryDate && formData.cvv
    if (step === 'account') return formData.email && formData.password && formData.confirmPassword
    return false
  }

  return (
    <div className="relative min-h-screen" style={{ background: 'linear-gradient(135deg, var(--color-header-1) 0%, var(--color-header-2) 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg border-2 border-yellow-400 flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-400">BR</span>
              </div>
              <div>
                <h3 className="font-bold text-sm">BEYOND REACH</h3>
                <p className="text-xs text-gray-300">Premier League</p>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold italic leading-tight">
                INDIA'S BIGGEST
              </h1>
              <h2 className="text-4xl md:text-6xl font-bold italic" style={{ color: 'var(--color-crickbroYellow)' }}>
                T10 TENNIS
              </h2>
              <h2 className="text-4xl md:text-6xl font-bold italic" style={{ color: 'var(--color-crickbroYellow)' }}>
                CRICKET TOURNAMENT
              </h2>
            </div>

            {/* Tagline */}
            <div className="space-y-3 pt-4">
              <p className="text-xl md:text-2xl font-bold">
                Your Gully Cricket Days <span style={{ color: 'var(--color-crickbroYellow)' }}>ARE OVER</span>
              </p>
              <p className="text-lg md:text-xl font-semibold">
                NOW PLAY IN REAL STADIUMS
              </p>
            </div>

            {/* Register Button */}
            <button className="mt-6 px-8 py-3 rounded-lg font-bold text-sm md:text-base transition-all transform hover:scale-105"
              style={{ backgroundColor: 'var(--color-crickbroYellow)', color: '#000' }}>
              REGISTER NOW
            </button>
          </div>

          {/* Right Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
            {/* Step Tabs */}
            <div className="flex gap-2 md:gap-4 mb-8 border-b border-white/20">
              {steps.map((step, idx) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isComplete = isStepComplete(step.id)

                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex-1 py-3 md:py-4 text-xs md:text-sm font-semibold transition-all relative group ${
                      isActive ? 'text-yellow-400' : 'text-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Icon size={16} />
                      <span className="hidden sm:inline">{step.label}</span>
                    </div>
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ backgroundColor: 'var(--color-crickbroYellow)' }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Form Content */}
            <div className="space-y-4">
              {/* Details Step */}
              {currentStep === 'details' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Select Your Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    >
                      <option value="">Choose your playing role</option>
                      <option value="batsman">Batsman</option>
                      <option value="bowler">Bowler</option>
                      <option value="allrounder">All-rounder</option>
                      <option value="wicketkeeper">Wicket Keeper</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Mobile Number</label>
                    <div className="flex gap-2">
                      <div className="w-20">
                        <input
                          type="text"
                          value="+91"
                          disabled
                          className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 focus:outline-none"
                        />
                      </div>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your mobile number"
                        className="flex-1 px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                      />
                      <button className="px-4 py-2 rounded-lg font-semibold text-white transition-all"
                        style={{ backgroundColor: 'var(--color-header-2)' }}>
                        Send OTP
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                      >
                        <option value="">Select State</option>
                        <option value="maharashtra">Maharashtra</option>
                        <option value="delhi">Delhi</option>
                        <option value="tamil-nadu">Tamil Nadu</option>
                        <option value="karnataka">Karnataka</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Trial City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Preferred City"
                        className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      id="terms"
                      className="rounded accent-yellow-400"
                    />
                    <label htmlFor="terms" className="text-white text-sm">
                      I agree to the <span style={{ color: 'var(--color-crickbroYellow)' }} className="cursor-pointer hover:underline">Terms and Conditions</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="Enter cardholder name"
                      className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="Enter card number"
                      maxLength="16"
                      className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="Enter CVV"
                        maxLength="3"
                        className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-white/10 border border-white/20">
                    <p className="text-white text-sm">
                      <span className="font-semibold">Total Amount:</span> <span style={{ color: 'var(--color-crickbroYellow)' }} className="font-bold text-lg">₹999</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Account Step */}
              {currentStep === 'account' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    />
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50">
                    <div className="flex items-center gap-2 text-green-400">
                      <Check size={20} />
                      <span className="text-sm font-semibold">All details verified successfully</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {currentStep !== 'details' && (
                <button
                  onClick={handlePrevStep}
                  className="flex-1 px-4 py-3 rounded-lg font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition"
                >
                  Previous
                </button>
              )}

              <button
                onClick={handleNextStep}
                disabled={!isStepComplete(currentStep)}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  isStepComplete(currentStep)
                    ? 'opacity-100 cursor-pointer hover:scale-105'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ backgroundColor: 'var(--color-header-2)' }}
              >
                {currentStep === 'account' ? (
                  <>
                    <span>Complete Registration</span>
                    <Check size={18} />
                  </>
                ) : (
                  <>
                    <span>Next Step</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterationForm
