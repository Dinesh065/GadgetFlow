// src/components/HowItWorksSection.jsx
import { motion } from "framer-motion";
import { Badge } from "../components/ui/badge";
import { Search, FileText, Zap } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Browse",
    description:
      "Explore our extensive catalog of premium electronics and gadgets. Filter by category, price, or brand.",
    delay: 0,
  },
  {
    icon: FileText,
    title: "2. Request",
    description:
      "Select your rental period and submit a request. Our team will verify availability and confirm your booking.",
    delay: 0.2,
  },
  {
    icon: Zap,
    title: "3. Rent",
    description:
      "Receive your gadget with free delivery. Enjoy your rental and return it when you're done.",
    delay: 0.4,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="landingcontainer px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <Badge variant="secondary" className="w-fit mx-auto bg-green-100 text-green-800">
            How It Works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Rent in 3 simple steps</h2>
          <p className="text-xl text-gray-600 max-w-[800px] mx-auto">
            Getting your favorite gadgets has never been easier. Follow these simple steps to start renting today.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: step.delay }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <step.icon className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
