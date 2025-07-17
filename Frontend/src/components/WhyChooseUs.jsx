import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { DollarSign, Shield, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    description: "Get premium gadgets at a fraction of the price. Flexible rental periods.",
  },
  {
    icon: Shield,
    title: "Verified Sellers",
    description: "All products go through quality checks and come from trusted providers.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day delivery in major cities. Get your tech right when you need it.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "No-hassle returns and easy rental extensions through your dashboard.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-32">
      <div className="landingcontainer px-4 md:px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge variant="secondary" className="bg-green-100 text-green-800">Why Choose Us</Badge>
          <h2 className="text-4xl font-bold mt-4">The Smart Way to Access Technology</h2>
          <p className="text-gray-600 max-w-xl mx-auto mt-2">We make renting electronics simple, affordable, and reliable with a customer-first approach.</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
              <Card className="text-center shadow-lg">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
