import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

/**
 * CTASection – a call‑to‑action banner with a gradient background and a pulsating button.
 * Props: none (static content for now).
 */
export default function CTASection() {
    const navigate = useNavigate();
    return (
        <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4 sm:px-6 lg:px-8 rounded-2xl shadow-lg mt-12 animate-fade-in-scale">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Ready to Transform Your Home?
                </h2>
                <p className="text-lg mb-6">
                    Book a professional service today and enjoy hassle‑free home maintenance with our trusted experts.
                </p>
                <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-md hover:bg-gray-100 transition-colors animate-pulse-glow"
                >
                    Explore Services <FiArrowRight className="ml-2" size={18} />
                </button>
            </div>
        </section>
    );
}
