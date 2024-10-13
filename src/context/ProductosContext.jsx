import { createContext, useEffect, useState } from "react";
import { helperPeticionesHttp } from "../helpers/helper-peticiones-http";

// ! CREANDO CONTEXTO
// ! 1. Creamos el contexto
const ProductosContext = createContext();
// ! 2. Armamos el provider
const ProductosProvider = ({ children }) => {
  const url = import.meta.env.VITE_BACKEND_PRODUCTOS;
  const [productos, setProductos] = useState(null);
  const [productoAEditar, setProductoAEditar] = useState(null);

  useEffect(() => {
    getAllProductos();
  }, []);

  const getAllProductos = async () => {
    try {
      const prods = await helperPeticionesHttp(url, {});

      // console.log(prods)
      setProductos(prods);
    } catch (error) {
      console.error("[getAllProductos]", error);
    }
  };

  const crearProductoContext = async (nuevoProducto) => {
    try {
      // console.log(nuevoProducto)

      const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      };

      const newProducto = await helperPeticionesHttp(url, options);

      console.log(newProducto);

      setProductos([...productos, newProducto]);
    } catch (error) {
      console.error("[crearProductoContext]", error);
    }
  };
  //ACTUALIZQAR PRODUCTO

  const actualizarProductoContext = async (productoEditado) => {
    // console.log(productoEditado)
    try {
      const options = {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(productoEditado),
      };

      const urlEdicion = url + productoEditado.id; // http://local.../productos/9

      const editedProduct = await helperPeticionesHttp(urlEdicion, options);

      const nuevoEstadoProductos = productos.map((producto) =>
        producto.id === editedProduct.id ? editedProduct : producto
      );
      setProductos(nuevoEstadoProductos);
    } catch (error) {
      console.error("[actualizarProductoContext]", error);
    }
  };

  //EDITAR PRODUCTO

  const editarProductoContext = async (productoEditado) => {
    try {
      const options = {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(productoEditado),
      };

      const urlEdicion = `${url}/${productoEditado.id}`;

      const editedProduct = await helperPeticionesHttp(urlEdicion, options);

      const nuevoEstadoProductos = productos.map((producto) =>
        producto.id === editedProduct.id ? editedProduct : producto
      );

      setProductos(nuevoEstadoProductos);
    } catch (error) {
      console.error("[editarProductoContext]", error);
    }
  };

  const eliminarProductoContext = async (idProducto) => {
    try {
      const options = {
        method: "DELETE",
      };

      const urlEliminacion = url + idProducto;

      await helperPeticionesHttp(urlEliminacion, options);

      // Actualizar el estado eliminando el producto
      const nuevosProductos = productos.filter(
        (producto) => producto.id !== idProducto
      );
      setProductos(nuevosProductos);
    } catch (error) {
      console.error("[eliminarProductoContext]", error);
    }
  };

  const data = {
    productos,
    crearProductoContext,
    actualizarProductoContext,
    eliminarProductoContext,
    editarProductoContext,
    productoAEditar,
    setProductoAEditar,
  };

  return (
    <ProductosContext.Provider value={data}>
      { children }
    </ProductosContext.Provider>
  );
};
// ! 3. Exportamos el contexto y provider

export { ProductosProvider };
export default ProductosContext;
