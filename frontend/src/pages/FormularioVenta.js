import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/forms.css";

function FormularioVenta() {
  const [formData, setFormData] = useState({
    idproducto: "",
    cantidad: 1,
    idcliente: "",
    idvendedor: localStorage.getItem("idusuario"),
  });
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("perfil");

  useEffect(() => {
    if (userRole !== "admin" && userRole !== "vendedor") {
      alert("No tienes permiso para acceder a esta página.");
      navigate("/productos");
    }

    // Cargar productos disponibles
    axios
      .get(`${process.env.REACT_APP_API_URL}/productos`)
      .then((response) => setProductos(response.data))
      .catch((error) => console.error("Error al cargar productos:", error));
  }, [navigate, userRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "idproducto" || name === "cantidad") {
      const producto = productos.find((p) => p.idproducto === parseInt(value));
      if (producto) {
        setTotal(producto.precio * formData.cantidad);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ventaData = { ...formData, total };
      await axios.post(`${process.env.REACT_APP_API_URL}/ventas`, ventaData);
      alert("Venta registrada exitosamente.");
      navigate("/ventas");
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert("Hubo un error al registrar la venta.");
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Registrar Venta</h2>

        <div className="input-group">
          <label htmlFor="idproducto">Producto</label>
          <select
            id="idproducto"
            name="idproducto"
            value={formData.idproducto}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un producto</option>
            {productos.map((producto) => (
              <option key={producto.idproducto} value={producto.idproducto}>
                {producto.nombre} - ${producto.precio}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="cantidad">Cantidad</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="input-group">
          <label>Total: ${total}</label>
        </div>

        <button type="submit" className="form-button">
          Registrar Venta
        </button>
      </form>
    </div>
  );
}

export default FormularioVenta;
