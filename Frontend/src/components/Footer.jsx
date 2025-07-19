import { Mail, Phone, MapPin, Zap, Linkedin, Github, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
        
        {/* Left Side: Logo and Description */}
        <div className="space-y-2 max-w-md">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-green-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">GadgetFlow</span>
          </div>
          <p className="text-sm text-gray-400">
            A platform to smartly rent electronics and gadgets with ease and security.
          </p>
          {/* <a href="/contact" className="text-green-400 text-sm hover:underline">
            Contact Us
          </a> */}
        </div>

        {/* Right Side: Contact Info and Socials */}
        <div className="text-sm text-gray-400 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +91 93593 49132
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> dineshc93593@gmail.com
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Maharashtra, India
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4 pt-2">
            <a href="https://www.linkedin.com/in/dinesh-choudhary-4aa2082aa" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5 text-white hover:text-green-500 transition" />
            </a>
            <a href="https://github.com/Dinesh065/" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5 text-white hover:text-green-500 transition" />
            </a>
            <a href="https://www.instagram.com/__.dinesh7.__?igsh=d2o3b2t0bGs3bXk3&utm_source=qr" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5 text-white hover:text-green-500 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-6 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Dinesh Choudhary. All rights reserved.
      </div>
    </footer>
  );
}
