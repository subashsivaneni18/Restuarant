"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-white text-blue-800 px-4 sm:px-8 py-12 font-['Poppins',sans-serif]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-4">
            Contact Quick Bite
          </h1>
          <p className="text-lg text-blue-600">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-blue-200 rounded-xl shadow p-8 space-y-6"
          >
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">
              Send Us a Message
            </h2>
            <div>
              <label htmlFor="name" className="block mb-2 text-blue-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-blue-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-blue-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Write your message here..."
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                Send Message
              </button>
            </div>
          </form>

          {/* Image */}
          <div className="w-full">
            <img
              src="/images/contact.jpg"
              alt="Contact Illustration"
              className="rounded-xl shadow-md w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Contact Info & Social Media */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-10 text-center text-blue-600">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Email */}
            <div className="bg-white border border-blue-200 rounded-xl shadow p-6 text-center hover:shadow-md transition-all duration-300">
              <FaEnvelope className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-blue-600 text-lg">contact@quickbite.com</p>
            </div>

            {/* Phone */}
            <div className="bg-white border border-blue-200 rounded-xl shadow p-6 text-center hover:shadow-md transition-all duration-300">
              <FaPhoneAlt className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-blue-600 text-lg">+1 234 567 890</p>
            </div>

            {/* Location */}
            <div className="bg-white border border-blue-200 rounded-xl shadow p-6 text-center hover:shadow-md transition-all duration-300">
              <FaMapMarkerAlt className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-blue-600 text-lg">
                123 Quick Bite St., City, Country
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-6 text-blue-600">
              Connect With Us
            </h2>
            <div className="flex justify-center space-x-6 text-3xl text-blue-600">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700 transition"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-800 transition"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
