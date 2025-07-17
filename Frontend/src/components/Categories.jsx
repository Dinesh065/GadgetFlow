import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Laptop, Camera, Gamepad2, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { icon: Laptop, title: "Laptops", description: "MacBooks, gaming laptops, ultrabooks, and more." },
  { icon: Camera, title: "Cameras", description: "DSLRs, mirrorless, action cameras, and accessories." },
  { icon: Gamepad2, title: "Gaming", description: "Consoles like PS5, Xbox, Nintendo Switch, VR gear." },
  { icon: Smartphone, title: "Smart Devices", description: "Tablets, smartwatches and smartphones" },
];

export default function Categories() {
  return (
    <section id="categories" className="py-20 md:py-32 bg-gray-50">
      <div className="landingcontainer px-4 md:px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge variant="secondary" className="bg-green-100 text-green-800">Categories</Badge>
          <h2 className="text-4xl font-bold mt-4">Explore Our Categories</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Everything you need for work, play, and creativity.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <cat.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>{cat.title}</CardTitle>
                  <CardDescription>{cat.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
