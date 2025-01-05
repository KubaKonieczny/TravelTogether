'use client'

import { useState, useEffect } from 'react'

const phrases = [
    "Welcome to Our Platform",
    "Discover Amazing Features",
    "Join Our Community Today",
    "Start Your Journey Here"
]

export default function TypewriterEffect() {
    const [currentPhrase, setCurrentPhrase] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentChar, setCurrentChar] = useState(0)

    useEffect(() => {
        if (currentChar < phrases[currentIndex].length) {
            const timeout = setTimeout(() => {
                setCurrentPhrase(prev => prev + phrases[currentIndex][currentChar])
                setCurrentChar(prev => prev + 1)
            }, 100)
            return () => clearTimeout(timeout)
        } else {
            const timeout = setTimeout(() => {
                setCurrentPhrase('')
                setCurrentChar(0)
                setCurrentIndex((prev) => (prev + 1) % phrases.length)
            }, 2000)
            return () => clearTimeout(timeout)
        }
    }, [currentIndex, currentChar])

    return (
        <h1 className="text-4xl font-bold text-white text-center">
            {currentPhrase}
            <span className="animate-blink">|</span>
        </h1>
    )
}