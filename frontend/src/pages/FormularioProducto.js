import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/forms.css";

function FormularioProducto() {
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    imagen: "",
  });
  const { id } = useParams(); // Para edición de producto (si aplica)
  const navigate = useNavigate();
  const userRole = localStorage.getItem("perfil");

  useEffect(() => {
    // Verificar rol del usuario
    if (userRole !== "admin" && userRole !== "vendedor") {
      alert("No tienes permiso para acceder a esta página.");
      navigate("/productos");
    }

    // Si hay un ID, cargar datos del producto para editar
    if (id) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/productos/${id}`)
        .then((response) => setFormData(response.data))
        .catch((error) => console.error("Error al cargar producto:", error));
    }
  }, [id, navigate, userRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Actualizar producto
        await axios.put(`${process.env.REACT_APP_API_URL}/productos/${id}`, formData);
        alert("Producto actualizado exitosamente.");
      } else {
        // Crear nuevo producto
        await axios.post(`${process.env.REACT_APP_API_URL}/productos`, formData);
        alert("Producto creado exitosamente.");
      }
      navigate("/productos");
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Hubo un error al guardar el producto.");
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>{id ? "Editar Producto" : "Agregar Producto"}</h2>

        <div className="input-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="categoria">Categoría</label>
          <input
            type="text"
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            placeholder="Categoría"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="precio">Precio</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="Precio"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Cantidad en stock"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="imagen">URL de Imagen</label>
          <input
            type="text"
            id="imagen"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            placeholder="URL de la imagen"
          />
        </div>

        <button type="submit" className="form-button">
          {id ? "Actualizar Producto" : "Agregar Producto"}
        </button>
      </form>
    </div>
  );
}

export default FormularioProducto;
