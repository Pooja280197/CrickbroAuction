import React, { useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'WHO CAN PARTICIPATE IN BRPL?',
      answer: 'Anyone with a passion for cricket can participate in BRPL! We welcome players of all age groups (18+), skill levels, and backgrounds. Whether you are a professional or a grassroots player, you can register and compete in age-inclusive categories designed for everyone.'
    },
    {
      question: 'DO I NEED TO TRAVEL FOR TRIALS OR AUDITIONS?',
      answer: 'Yes, trials and auditions are conducted at various centers across the country. We try to have events in multiple cities to minimize travel distances. However, the exact locations depend on the number of registrations and logistics. All details about trial locations will be provided after registration.'
    },
    {
      question: 'HOW DOES THE SELECTION PROCESS WORK?',
      answer: 'The selection process is purely skill-based and transparent. Players participate in trials/auditions where their performance is evaluated by professional scouts and selectors. The best performers are selected for auction, where they get drafted into teams based on their performance metrics.'
    },
    {
      question: 'WHAT MAKES BRPL DIFFERENT FROM OTHER CRICKET LEAGUES?',
      answer: 'BRPL stands out with its grassroots approach, professional stadium experience, and age-inclusive categories. We provide fair selection process, national TV coverage, ₹3 crore prize pool, talent scout access, and career launch opportunities. It\'s truly a celebration of champions!'
    },
    {
      question: 'WHAT IS THE REGISTRATION PROCESS?',
      answer: 'Registration is simple and quick. Visit our website or app, fill in your details, select your role (Batsman, Bowler, All-rounder, Wicket Keeper), complete the payment, and you\'re registered! You\'ll receive all trial details and schedules via email and SMS.'
    },
    {
      question: 'WHAT IS THE REGISTRATION FEE?',
      answer: 'The registration fee is ₹999. This fee helps us organize professional trials, manage logistics, and ensure high-quality events. The fee is a one-time payment and includes access to all trials and auditions.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="relative min-h-screen py-12 md:py-20 bg-gray-50">
      {/* Container */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span style={{ color: 'var(--color-header-1)' }}>FREQUENTLY ASKED </span>
            <span style={{ color: 'var(--color-crickbroYellow)' }}>QUESTIONS</span>
          </h2>
          
          {/* Yellow Underline */}
          <div className="flex justify-center mt-6">
            <div className="h-1 w-24" style={{ backgroundColor: 'var(--color-crickbroYellow)' }} />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 md:space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-sm md:text-base font-bold uppercase tracking-wide pr-4"
                  style={{ color: 'var(--color-header-1)' }}>
                  {faq.question}
                </h3>

                <ChevronDown
                  size={24}
                  className="flex-shrink-0 transition-transform duration-300"
                  style={{
                    color: 'var(--color-header-1)',
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 md:px-8 pb-5 md:pb-6 text-gray-600 text-sm md:text-base leading-relaxed border-t border-gray-100">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Button - Fixed */}
      <div className="fixed bottom-8 right-8 z-40 animate-bounce">
        <button
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all transform hover:scale-110 flex items-center justify-center"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={32} />
        </button>
      </div>

      {/* Register Now Button - Fixed Bottom Right */}
      <div className="fixed bottom-8 right-28 md:right-24 z-40">
        <button
          className="px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base flex items-center gap-2 transition-all transform hover:scale-110 shadow-lg"
          style={{
            backgroundColor: 'var(--color-crickbroYellow)',
            color: '#000'
          }}
        >
          <span>⚡</span>
          REGISTER NOW
        </button>
      </div>
    </div>
  )
}

export default FAQ
