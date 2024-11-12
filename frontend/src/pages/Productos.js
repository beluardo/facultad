import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/products.css";

function ListadoProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/productos`)
      .then((response) => setProductos(response.data))
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  return (
    <div className="products-container">
      <h2>Catálogo de Productos</h2>
      <div className="products-list">
        {productos.map((producto) => (
          <div
            key={producto.idproducto}
            className={`product-card ${
              producto.stock < 10 ? "low-stock" : "in-stock"
            }`}
          >
            <img src={producto.imagen} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p>Categoría: {producto.categoria}</p>
            <p>Precio: ${producto.precio}</p>
            <p>Stock: {producto.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListadoProductos;
