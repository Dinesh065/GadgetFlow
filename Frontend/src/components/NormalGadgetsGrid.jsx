import React from "react";
import Card from "./Card"; // Import the Card component
import "./NormalGadgetsGrid.css"; // Import container styles

const gadgets = [
  {
    id: 1,
    name: "Nike Sneaker (Green)",
    price: "$120",
    image: "https://cdn.pixabay.com/photo/2018/09/30/21/27/sneakers-3714720_1280.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, dignissimos.",
  },
  {
    id: 2,
    name: "Nike Sneaker (Green)",
    price: "$120",
    image: "https://cdn.pixabay.com/photo/2019/10/01/19/42/basketball-4519198__480.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, dignissimos.",
  },
];

const NormalGadgetsGrid = () => {
  return (

    <div className="container">
        {gadgets.map((gadget) => (
          <Card 
            key={gadget.id} 
            name={gadget.name} 
            price={gadget.price} 
            image={gadget.image} 
          />
        ))}
    </div>
  );
};

export default NormalGadgetsGrid;
