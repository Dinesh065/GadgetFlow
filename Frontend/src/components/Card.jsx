import React from "react";
import "./Card.css";

const Card = (props) => {
  return (
        <div className="card" key={props.id}>
          <img src={props.image} alt={props.name} />
          <div className="card-body">
            <div className="row">
              <div className="card-title">
                <h4>{props.name}</h4>
                <h3>{props.price}</h3>
              </div>
              <div className="view-btn">
                <a href="/">View Details</a>
              </div>
            </div>
            <hr />
            <p>{props.description}</p>
            <div className="btn-group">
              <button className="button-29">Buy Now</button>
            </div>
          </div>
        </div>
  );
};

export default Card;
