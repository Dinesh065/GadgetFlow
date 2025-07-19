import { Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import navigate

const ContactUs = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate(); // <-- initialize navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-16 px-4">
      <div className="max-w-5xl mx-auto relative">

        {/* White Box Container */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 relative">
          <h2 className="text-3xl font-bold text-center mb-8 text-green-700">Contact Us</h2>

          {formSubmitted && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded shadow-md z-50">
              Message sent successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Get in Touch</h3>
                <p className="text-gray-600 text-sm">
                  I'd love to hear from you. Whether it's feedback, a question, or a partnership opportunity.
                </p>
              </div>

              <div className="text-sm text-gray-700 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  +91 93593 49132
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  dineshc93593@gmail.com
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Maharashtra, India
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
