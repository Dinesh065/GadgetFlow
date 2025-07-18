import { Card, CardHeader, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
// import userAvatar from "../../public/images/logo.png";
const testimonials = [
  {
    text: "RentTech saved me thousands! I needed a MacBook Pro for a project. Seamless rental, excellent condition.",
    name: "Alex Chen",
    role: "Freelance Designer",
  },
  {
    text: "Perfect for trying before buying! I rented a camera for vacation and loved it. Great service!",
    name: "Sarah Johnson",
    role: "Travel Blogger",
  },
  {
    text: "As a student, this service is a lifesaver. I use top-tier devices without breaking the bank!",
    name: "Mike Rodriguez",
    role: "Computer Science Student",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-gray-50">
      <div className="landingcontainer px-4 md:px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge variant="secondary" className="bg-green-100 text-green-800">Testimonials</Badge>
          <h2 className="text-4xl font-bold mt-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-xl mx-auto mt-2">Thousands of users love our easy rental service.</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }}>
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base">"{t.text}"</CardDescription>
                </CardHeader>
                <div className="px-6 pb-6 flex items-center space-x-4">
                  <img src={userAvatar} alt={t.name} width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-600">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
