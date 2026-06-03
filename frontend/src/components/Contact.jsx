import React, { useState } from "react";
import link from "../assets/linkedin.png";
import git from "../assets/github.png";
import twit from "../assets/twitter.png";
import { useSelector } from "react-redux";

const Contact = () => {
  const { currentCity } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [emailError, setEmailError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateEmail = () => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    setEmailError(isValid ? "" : "Invalid email address");
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateEmail()) {
      return;
    }
    console.log(formData);
    alert("Message sent!");
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div
      className="h-fit flex flex-col justify-center items-center p-6 bg-tomato"
      id="contact"
    >
      <h2 className="text-3xl font-semibold text-black mb-8">Contact Us</h2>
      <div className="w-full max-w-6xl flex flex-wrap lg:flex-nowrap gap-8 bg-white p-6 rounded-lg shadow-lg">
        {/* Contact Form Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-semibold text-black mb-4">
            Send a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full text-black border border-tomato rounded-lg p-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full text-black border ${
                  emailError ? "border-red-500" : "border-tomato"
                } rounded-lg p-2`}
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-tomato text-black rounded-lg p-2 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Send
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="w-full lg:w-1/2">
          <div className="w-full h-80 lg:h-full rounded-lg overflow-hidden">
            {currentCity ? (
              <iframe
                src={`https://maps.google.com/maps?q=${currentCity}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Current Location"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black">
                Loading location...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="flex gap-10 mt-10 shadow-3xl p-4 rounded-lg">
        <div className="social">
          <a
            href="https://www.linkedin.com/in/sahebkumar12/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={link}
              alt="LinkedIn"
              width={40}
              className="hover:scale-125 transition-transform cursor-pointer"
            />
          </a>
        </div>
        <div className="social">
          <a
            href="https://github.com/skraj321"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={git}
              alt="GitHub"
              width={40}
              className="hover:scale-125 transition-transform cursor-pointer"
            />
          </a>
        </div>
        <div className="social">
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <img
              src={twit}
              alt="Twitter"
              width={40}
              className="hover:scale-125 transition-transform cursor-pointer"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
