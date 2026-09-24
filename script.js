
        /* ============================================================
           SECCIÓN JAVASCRIPT (el "cerebro" de la aplicación)
           ============================================================
           Aquí guardamos los datos en "arrays" (listas). En un
           sistema real, en vez de arrays usaríamos una base de datos
           (por ejemplo SQL Server), pero para aprender la lógica de
           un inventario, un array cumple perfectamente la función.
        ============================================================ */

        // Lista de proveedores. Cada proveedor es un "objeto" con
        // sus datos (nombre, nit, telefono, direccion).
        let proveedores = [];

        // Lista de productos.
        let productos = [];

        // Lista de clientes.
        let clientes = [];

        // Objeto (no lista, porque solo hay UN conjunto de parámetros)
        // con los valores por defecto del sistema.
        let parametrosGenerales = {
            empresa: "",
            moneda: "$",
            iva: 19
        };

        // Esta variable guarda si el usuario ya inició sesión o no.
        let sesionActiva = false;


        /* ------------------------------------------------------------
           FUNCIÓN: mostrarSeccion(nombreSeccion)
           ------------------------------------------------------------
           Se encarga de mostrar la sección que el usuario eligió en
           el menú, y ocultar las demás. También marca visualmente
           cuál botón del menú está "activo".
        ------------------------------------------------------------ */
        function mostrarSeccion(nombreSeccion) {

            // Si el usuario no ha iniciado sesión, no dejamos entrar
            // a ninguna sección distinta de "ingreso".
            if (!sesionActiva && nombreSeccion !== 'ingreso') {
                return; // "return" sin más código detiene la función aquí
            }

            // 1) Ocultamos TODAS las secciones.
            //    document.querySelectorAll(".seccion") busca en el HTML
            //    todos los elementos que tengan la clase "seccion" y
            //    nos devuelve una lista de ellos.
            const todasLasSecciones = document.querySelectorAll(".seccion");
            todasLasSecciones.forEach(function (seccion) {
                seccion.classList.remove("seccion-activa");
            });

            // 2) Mostramos SOLO la sección que corresponde.
            //    Buscamos el elemento cuyo id sea "seccion-" + el nombre
            //    (por ejemplo: "seccion-productos")
            const seccionElegida = document.getElementById("seccion-" + nombreSeccion);
            if (seccionElegida) {
                seccionElegida.classList.add("seccion-activa");
            }

            // 3) Actualizamos qué botón del menú se ve "activo"
            const todosLosBotones = document.querySelectorAll(".boton-menu");
            todosLosBotones.forEach(function (boton) {
                boton.classList.remove("activo");
                if (boton.dataset.seccion === nombreSeccion) {
                    boton.classList.add("activo");
                }
            });
        }


        /* ------------------------------------------------------------
           FUNCIÓN: iniciarSesion()
           ------------------------------------------------------------
           Valida que el usuario haya escrito algo en los campos de
           usuario y contraseña. Este es un login DE EJEMPLO: no se
           conecta a ninguna base de datos, solo revisa que los campos
           no estén vacíos, para enseñar el concepto de validación.
        ------------------------------------------------------------ */
        function iniciarSesion() {
            // ".value" obtiene el texto que el usuario escribió en el input
            // ".trim()" elimina espacios en blanco al inicio/final
            const usuario = document.getElementById("usuario").value.trim();
            const clave = document.getElementById("clave").value.trim();
            const cajaError = document.getElementById("error-login");

            // Validación: ambos campos son obligatorios
            if (usuario === "" || clave === "") {
                cajaError.textContent = "Debes escribir usuario y contraseña.";
                return;
            }

            // Si llegamos aquí, la validación pasó correctamente
            cajaError.textContent = ""; // limpiamos cualquier error anterior
            sesionActiva = true;

            // Habilitamos los botones del menú que estaban bloqueados
            const botonesDelMenu = document.querySelectorAll(".boton-menu");
            botonesDelMenu.forEach(function (boton) {
                boton.disabled = false;
            });

            // Mostramos un mensaje de bienvenida
            const mensaje = document.getElementById("mensaje-bienvenida");
            mensaje.style.display = "block";
            // "innerHTML" nos permite insertar texto con formato dentro
            // del elemento (aquí usamos <strong> para negrita)
            mensaje.innerHTML = "✅ Bienvenido(a), <strong>" + usuario + "</strong>. " +
                "Ya puedes usar el menú de la izquierda para navegar por el sistema.";
        }


        /* ------------------------------------------------------------
           SECCIÓN: PROVEEDORES
           ------------------------------------------------------------ */

        // Agrega un nuevo proveedor a la lista y refresca la tabla
        function agregarProveedor() {
            const nombre = document.getElementById("prov-nombre").value.trim();
            const nit = document.getElementById("prov-nit").value.trim();
            const telefono = document.getElementById("prov-telefono").value.trim();
            const direccion = document.getElementById("prov-direccion").value.trim();
            const cajaError = document.getElementById("error-proveedores");

            // Validación simple: nombre y NIT son obligatorios
            if (nombre === "" || nit === "") {
                cajaError.textContent = "El nombre y el NIT son obligatorios.";
                return;
            }
            cajaError.textContent = "";

            // Creamos un objeto con los datos del proveedor y lo
            // agregamos ("push") al final del array "proveedores"
            proveedores.push({
                nombre: nombre,
                nit: nit,
                telefono: telefono,
                direccion: direccion
            });

            // Limpiamos los campos del formulario para el siguiente registro
            document.getElementById("prov-nombre").value = "";
            document.getElementById("prov-nit").value = "";
            document.getElementById("prov-telefono").value = "";
            document.getElementById("prov-direccion").value = "";

            // Volvemos a dibujar la tabla con el nuevo dato incluido
            dibujarTablaProveedores();
        }

        // Elimina un proveedor según su posición ("índice") en el array
        function eliminarProveedor(indice) {
            // "splice(indice, 1)" elimina 1 elemento a partir de esa posición
            proveedores.splice(indice, 1);
            dibujarTablaProveedores();
        }

        // Recorre el array "proveedores" y construye las filas de la tabla
        function dibujarTablaProveedores() {
            const cuerpoTabla = document.getElementById("tabla-proveedores");

            // Si no hay proveedores, mostramos un mensaje amigable
            if (proveedores.length === 0) {
                cuerpoTabla.innerHTML = '<tr><td colspan="5" class="tabla-vacia">Aún no hay proveedores registrados.</td></tr>';
                return;
            }

            // "map" recorre cada proveedor y genera el HTML de su fila.
            // "join('')" une todas las filas en un solo texto largo.
            cuerpoTabla.innerHTML = proveedores.map(function (proveedor, indice) {
                return `
                    <tr>
                        <td>${proveedor.nombre}</td>
                        <td>${proveedor.nit}</td>
                        <td>${proveedor.telefono}</td>
                        <td>${proveedor.direccion}</td>
                        <td><button class="boton boton-eliminar" onclick="eliminarProveedor(${indice})">Eliminar</button></td>
                    </tr>
                `;
            }).join('');
        }


        /* ------------------------------------------------------------
           SECCIÓN: PRODUCTOS
           ------------------------------------------------------------ */

        function agregarProducto() {
            const codigo = document.getElementById("prod-codigo").value.trim();
            const nombre = document.getElementById("prod-nombre").value.trim();
            // "parseFloat" convierte el texto del input en un número decimal
            const precio = parseFloat(document.getElementById("prod-precio").value);
            const cantidad = parseInt(document.getElementById("prod-cantidad").value);
            const cajaError = document.getElementById("error-productos");

            // Validaciones: código y nombre no vacíos, precio y cantidad
            // deben ser números válidos y no negativos
            if (codigo === "" || nombre === "") {
                cajaError.textContent = "El código y el nombre son obligatorios.";
                return;
            }
            // "isNaN" pregunta "¿esto NO es un número?"
            if (isNaN(precio) || precio < 0 || isNaN(cantidad) || cantidad < 0) {
                cajaError.textContent = "El precio y la cantidad deben ser números válidos.";
                return;
            }
            cajaError.textContent = "";

            productos.push({
                codigo: codigo,
                nombre: nombre,
                precio: precio,
                cantidad: cantidad
            });

            document.getElementById("prod-codigo").value = "";
            document.getElementById("prod-nombre").value = "";
            document.getElementById("prod-precio").value = "";
            document.getElementById("prod-cantidad").value = "";

            dibujarTablaProductos();
        }

        function eliminarProducto(indice) {
            productos.splice(indice, 1);
            dibujarTablaProductos();
        }

        function dibujarTablaProductos() {
            const cuerpoTabla = document.getElementById("tabla-productos");

            if (productos.length === 0) {
                cuerpoTabla.innerHTML = '<tr><td colspan="6" class="tabla-vacia">Aún no hay productos registrados.</td></tr>';
                return;
            }

            cuerpoTabla.innerHTML = productos.map(function (producto, indice) {
                // Calculamos el valor total de ese producto en inventario
                const valorTotal = producto.precio * producto.cantidad;
                return `
                    <tr>
                        <td>${producto.codigo}</td>
                        <td>${producto.nombre}</td>
                        <td>${parametrosGenerales.moneda}${producto.precio.toLocaleString('es-CO')}</td>
                        <td>${producto.cantidad}</td>
                        <td>${parametrosGenerales.moneda}${valorTotal.toLocaleString('es-CO')}</td>
                        <td><button class="boton boton-eliminar" onclick="eliminarProducto(${indice})">Eliminar</button></td>
                    </tr>
                `;
            }).join('');
        }


        /* ------------------------------------------------------------
           SECCIÓN: CLIENTES
           ------------------------------------------------------------ */

        function agregarCliente() {
            const nombre = document.getElementById("cli-nombre").value.trim();
            const cedula = document.getElementById("cli-cedula").value.trim();
            const telefono = document.getElementById("cli-telefono").value.trim();
            const correo = document.getElementById("cli-correo").value.trim();
            const cajaError = document.getElementById("error-clientes");

            if (nombre === "" || cedula === "") {
                cajaError.textContent = "El nombre y la cédula son obligatorios.";
                return;
            }
            cajaError.textContent = "";

            clientes.push({
                nombre: nombre,
                cedula: cedula,
                telefono: telefono,
                correo: correo
            });

            document.getElementById("cli-nombre").value = "";
            document.getElementById("cli-cedula").value = "";
            document.getElementById("cli-telefono").value = "";
            document.getElementById("cli-correo").value = "";

            dibujarTablaClientes();
        }

        function eliminarCliente(indice) {
            clientes.splice(indice, 1);
            dibujarTablaClientes();
        }

        function dibujarTablaClientes() {
            const cuerpoTabla = document.getElementById("tabla-clientes");

            if (clientes.length === 0) {
                cuerpoTabla.innerHTML = '<tr><td colspan="5" class="tabla-vacia">Aún no hay clientes registrados.</td></tr>';
                return;
            }

            cuerpoTabla.innerHTML = clientes.map(function (cliente, indice) {
                return `
                    <tr>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.cedula}</td>
                        <td>${cliente.telefono}</td>
                        <td>${cliente.correo}</td>
                        <td><button class="boton boton-eliminar" onclick="eliminarCliente(${indice})">Eliminar</button></td>
                    </tr>
                `;
            }).join('');
        }


        /* ------------------------------------------------------------
           SECCIÓN: PARÁMETROS GENERALES
           ------------------------------------------------------------ */

        function guardarParametros() {
            const empresa = document.getElementById("param-empresa").value.trim();
            const moneda = document.getElementById("param-moneda").value.trim();
            const iva = parseFloat(document.getElementById("param-iva").value);
            const cajaError = document.getElementById("error-parametros");

            if (empresa === "" || moneda === "") {
                cajaError.textContent = "El nombre de la empresa y el símbolo de moneda son obligatorios.";
                return;
            }
            if (isNaN(iva) || iva < 0 || iva > 100) {
                cajaError.textContent = "El IVA debe ser un número entre 0 y 100.";
                return;
            }
            cajaError.textContent = "";

            // Actualizamos el objeto de parámetros generales.
            // Este objeto es usado, por ejemplo, por la tabla de
            // productos para mostrar el símbolo de moneda correcto.
            parametrosGenerales.empresa = empresa;
            parametrosGenerales.moneda = moneda;
            parametrosGenerales.iva = iva;

            mostrarResumenParametros();

            // Como el símbolo de moneda pudo cambiar, volvemos a
            // dibujar la tabla de productos para que se vea actualizada
            dibujarTablaProductos();
        }

        function mostrarResumenParametros() {
            const resumen = document.getElementById("resumen-parametros");
            resumen.innerHTML = `
                <p><strong>Empresa:</strong> ${parametrosGenerales.empresa}</p>
                <p><strong>Moneda:</strong> ${parametrosGenerales.moneda}</p>
                <p><strong>IVA configurado:</strong> ${parametrosGenerales.iva}%</p>
            `;
        }


        /* ------------------------------------------------------------
           INICIALIZACIÓN
           ------------------------------------------------------------
           Estas líneas se ejecutan una sola vez, apenas se carga la
           página, para que las tablas no aparezcan completamente
           vacías (sin ni siquiera el mensaje de "no hay datos").
        ------------------------------------------------------------ */
        dibujarTablaProveedores();
        dibujarTablaProductos();
        dibujarTablaClientes();
        mostrarResumenParametros();

