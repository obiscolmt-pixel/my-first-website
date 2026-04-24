import React, { useState, useRef, useEffect } from 'react'
import { AiOutlineClose, AiOutlineSend } from 'react-icons/ai'
import { BsChatDotsFill } from 'react-icons/bs'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! 👋 Welcome to OBISCO Store! I'm your virtual assistant and business companion. I can help you shop, give business ideas, financial tips and more. How can I help you today?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

 const quickQuestions = [
    "What phones do you have?",
    "Do you sell men's clothing?",
    "Give me a business idea",
    "How do I make money in Nigeria?",
    "How do I pay?",
    "Do you have perfumes?",
  ]

  const toggleChat = (value) => {
    setIsOpen(value)
    document.body.style.overflow = value ? 'hidden' : 'unset'
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const callAI = async (updatedMessages) => {
    const response = await fetch('https://obisco-gadgets-backend.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updatedMessages }),
    })
    const data = await response.json()
    return data.reply
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage = { role: 'user', content: input.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    try {
      const reply = await callAI(updatedMessages)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please contact us on WhatsApp: +234 904 986 3067 😊"
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickQuestion = async (question) => {
    if (loading) return
    const userMessage = { role: 'user', content: question }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setLoading(true)
    try {
      const reply = await callAI(updatedMessages)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please contact us on WhatsApp: +234 904 986 3067 😊"
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {isOpen && (
        <div className='fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-100 overflow-hidden'>

          {/* Header */}
          <div className='bg-orange-500 px-4 py-3 flex items-center justify-between shrink-0'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 bg-white rounded-full flex items-center justify-center'>
                <BsChatDotsFill size={18} className='text-orange-500' />
              </div>
              <div>
                <p className='font-bold text-white text-sm'>OBISCO Support</p>
                <div className='flex items-center gap-1'>
                  <div className='w-2 h-2 bg-green-300 rounded-full animate-pulse' />
                  <p className='text-orange-100 text-xs'>Online — replies instantly</p>
                </div>
              </div>
            </div>
            <button onClick={() => toggleChat(false)} className='text-white hover:text-orange-200 transition'>
              <AiOutlineClose size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3'>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className='w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1'>
                    <BsChatDotsFill size={12} className='text-orange-500' />
                  </div>
                )}
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-orange-500 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className='flex justify-start'>
                <div className='w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1'>
                  <BsChatDotsFill size={12} className='text-orange-500' />
                </div>
                <div className='bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm'>
                  <div className='flex gap-1'>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && !loading && (
            <div className='px-4 pb-2 flex flex-wrap gap-2 shrink-0'>
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className='text-xs bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-100 transition'
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className='px-4 py-3 border-t bg-gray-50 shrink-0'>
            <div className='flex items-center gap-2 bg-white border rounded-full px-4 py-2'>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Type your message...'
                className='flex-1 text-sm focus:outline-none bg-transparent'
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className='text-orange-500 hover:text-orange-600 disabled:text-gray-300 transition shrink-0'
              >
                <AiOutlineSend size={20} />
              </button>
            </div>
            <p className='text-center text-xs text-gray-400 mt-1'>
              Powered by AI • Available 24/7
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => toggleChat(!isOpen)}
        className='fixed bottom-6 right-4 sm:right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50'
      >
        {isOpen ? <AiOutlineClose size={24} /> : <BsChatDotsFill size={24} />}
      </button>
    </>
  )
}

export default ChatBot