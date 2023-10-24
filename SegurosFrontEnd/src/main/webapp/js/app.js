class App{
  dom;
  modal;
  
  registerModal 
  
  state;  
  
  cliente; 
  categoria;
  admin;
  vehiculo;

  constructor(){
    this.state={};
    this.dom=this.render(); 
    this.modal = new bootstrap.Modal(this.dom.querySelector('#app>#modal'));
    this.editModal = new bootstrap.Modal(this.dom.querySelector('#app>#editModal'));
    this.registerModal = new bootstrap.Modal(this.dom.querySelector('#app>#registerModal'));
    this.dom.querySelector('#app>#modal #apply').addEventListener('click',e=>this.login());
    this.dom.querySelector('#registerModal #registerForm').addEventListener('submit', e => {
      e.preventDefault(); 
      this.register(); 
    });
    this.renderBodyFiller();
    this.renderMenuItems();
    this.cliente = new Cliente();
    this.categoria = new Categoria();
    this.admin = new Admin();
    this.vehiculo = new Vehiculo();
  }
  
  render=()=>{
    const html= `
            ${this.renderMenu()}
            ${this.renderBody()} 
            ${this.renderFooter()}
            ${this.renderModal()}
            ${this.renderEditModal()}
        `;
       var rootContent= document.createElement('div');
       rootContent.id='app';
       rootContent.innerHTML=html;
       return rootContent;
  }
  
    renderMenu = () => {
      return `
        <header class="bg-dark text-light" id="menu">
          <div class="container d-flex justify-content-between align-items-center py-3">
            <div class="logo">
              <img src="images/logo2.png" alt="Logo" style="max-width: 400px;" class="logo-image">
            </div>
            <div class="title ml-auto">
            </div>
            <nav class="navbar navbar-expand-lg navbar-dark" id="menuNav">
              <div class="collapse navbar-collapse" id="menuItems">
              </div>
            </nav>
          </div>
        </header>
      `;
    }
  
   renderBody=()=>{
    return `
        <div id="body">   
        </div>          
    `;
  }

   renderFooter = () => {
      return `
        <footer class="footer mt-auto bg-dark text-white fixed-bottom" style="padding: 20px 0;">
          <div class="container text-center">
            <div class="row">
              <div class="col-md-4">
                <p class="mb-0">Faxe Inc.</p>
              </div>
              <div class="col-md-4">
                <p class="mb-0">
                  <a href="#" class="text-white"><i class="fab fa-twitter fa-lg"></i></a>
                  <a href="#" class="text-white"><i class="fab fa-facebook fa-lg"></i></a>
                  <a href="#" class="text-white"><i class="fab fa-instagram fa-lg"></i></a>
                </p>
              </div>
              <div class="col-md-4">
                <p class="mb-0">©2023</p>
              </div>
            </div>
          </div>
        </footer>
      `;
    }
  

   renderModal=()=>{
    return `
        <div id="modal" class="modal fade" tabindex="-1">
          <div class="modal-dialog" style="height: 600px;">
            <div class="modal-content bg-dark text-light">
              <div class="modal-header">
                <img class="img-circle" id="img_logo" src="images/logo.png" style="max-width: 50px; max-height: 50px" alt="logo">
                <span style='margin-left:4em;font-weight: bold;'>Iniciar sesión</span>
                <button type="button" class="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form id="form">
                <div class="modal-body">
                  <div class="input-group mb-3">
                    <span class="input-group-text bg-dark text-light"><i class="fas fa-user"></i></span>
                    <input type="text" class="form-control bg-dark text-light" id="usuario" name="usuario">
                  </div>
                  <div class="input-group mb-3">
                    <span class="input-group-text bg-dark text-light"><i class="fas fa-lock"></i></span>
                    <input type="password" class="form-control bg-dark text-light" id="contraseña" name="contraseña">
                  </div>
                </div>
                <div class="modal-footer justify-content-center">
                  <button id="apply" type="button" class="btn btn-primary click-animation">Iniciar sesión</button>
                </div>
                <div class="text-center mb-3">
                  <span style="font-style: italic; color: lightgray;">¿No tiene cuenta? ... </span>
                </div>
                <div class="d-flex justify-content-center">
                  <a id="register" class="btn btn-info hover-animation click-animation" style="background-color: white; color:red; border:1px solid red; margin-bottom:10px;" href="#">Regístrese aquí</a>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div id="registerModal" class="modal fade" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content bg-dark text-light">
              <div class="modal-header">
                <img class="img-circle" id="img_logo" src="images/logo.png" style="max-width: 50px; max-height: 50px" alt="logo">
                <span style='margin-left:4em;font-weight: bold;'>Registro</span>
                <button type="button" class="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form id="registerForm">
                <div class="modal-body">
                  <div class="input-group mb-3">
                    <label class="input-group-text bg-dark text-light">Cédula</label>
                    <input type="text" class="form-control bg-dark text-light" id="cedula" name="cedula" placeholder="Ingrese su identificación" required>
                  </div>
                  <div class="input-group mb-3">
                    <label class="input-group-text bg-dark text-light">Nombre de Usuario</label>
                    <input type="text" class="form-control bg-dark text-light" id="usuario" name="usuario" placeholder="Ingrese su nombre de usuario" required>
                  </div>
                  <div class="input-group mb-3">
                    <label class="input-group-text bg-dark text-light">Contraseña</label>
                    <input type="password" class="form-control bg-dark text-light" id="contrasena" name="contrasena" placeholder="Ingrese su contraseña" required>
                  </div>
                  <div class="input-group mb-3">
                    <label class="input-group-text bg-dark text-light">Nombre</label>
                    <input type="text" class="form-control bg-dark text-light" id="nombre" name="nombre" placeholder="Ingrese su nombre" required>
                  </div>
                  <div class="input-group mb-3">
                    <label class="input-group-text bg-dark text-light">Teléfono</label>
                    <input type="text" class="form-control bg-dark text-light" id="telefono" name="telefono" placeholder="Ingrese su número de teléfono" required>
                  </div>
                  <div class="input-group mb-3">
                    <label class="input-group-text bg-dark text-light">Correo Electrónico</label>
                    <input type="email" class="form-control bg-dark text-light" id="correo" name="correo" placeholder="Ingrese su correo electrónico" required>
                  </div>
                  <div class="input-group mb-3">
                    <label class="input-group-text bg-dark text-light">Número de Tarjeta</label>
                    <input type="text" class="form-control bg-dark text-light" id="numeroTarjeta" name="numeroTarjeta" placeholder="Ingrese su número de tarjeta" required>
                  </div>
                  <div class="input-group mb-3">
                    <label class="input-group-text bg-dark text-light">Fecha de Vencimiento</label>
                    <input type="month" class="form-control bg-dark text-light" id="vencimientoTarjeta" name="vencimientoTarjeta" placeholder="Ingrese la fecha de vencimiento de la tarjeta" required>
                  </div>
                  <div class="input-group mb-3">
                    <label class="input-group-text bg-dark text-light">CVC</label>
                    <input type="text" class="form-control bg-dark text-light" id="cvcTarjeta" name="cvcTarjeta" placeholder="Ingrese el código CVC de su tarjeta" required>
                  </div>
                </div>
                <div class="modal-footer justify-content-center">
                  <button id="registerConfirm" type="submit" class="btn btn-primary click-animation">Confirmar Registro</button>
                </div>
              </form>
            </div>
          </div>
        </div>
    `;
  }

   renderBodyFiller = () => {
      const html = `
      <br><br>
        <div id='bodyFiller' class="text-center">
          <img src="images/grandImage.gif" class="img-fluid rounded-circle" style="max-width: 400px;" alt="Imagen Grande">
          <div style="margin-top: 20px;">
            <h2>Por qué elegir nuestro seguro automovilístico?</h2>
            <p>
              En nuestra empresa, nos preocupamos por tu seguridad y tranquilidad. Nuestro seguro automovilístico ofrece una amplia cobertura y beneficios que te brindan la protección necesaria en caso de cualquier eventualidad en la carretera.
            </p>
            <p>
              Con nuestro seguro, obtendrás asistencia en carretera las 24 horas, atención personalizada, reparaciones y servicios de calidad, además de una rápida y sencilla gestión de reclamos. Nos enfocamos en brindarte una experiencia satisfactoria y confiable.
            </p>
            <p>
              Protege tu vehículo y a ti mismo/a con nuestro seguro automovilístico. No te arriesgues y viaja con la tranquilidad que mereces. ¡Contáctanos hoy mismo y descubre por qué somos la mejor opción!
            </p>
          </div>
        </div>
      `;
      this.dom.querySelector('#app>#body').replaceChildren();
      this.dom.querySelector('#app>#body').innerHTML = html;
    }


    renderMenuItems=()=>{
        var html='';
        if (globalstate.user === null) {
            html += `
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link" id="login" href="#"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</a>
                </li>
              </ul>
            `;
          } else {
            if (globalstate.user.tipo === 'Cliente') {
              html += `
                <ul class="navbar-nav">
                  <li class="nav-item">
                    <a class="nav-link" id="polizas" href="#"><i class="fas fa-file-alt"></i> Pólizas</a>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fas fa-user"></i> ${globalstate.user.usuario}
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li><a class="dropdown-item" id="editProfile" href="#"><i class="fas fa-edit"></i> Editar Perfil</a></li>
                      <li><a class="dropdown-item" id="logout1" href="#"><i class="fas fa-sign-out-alt"></i> Salir</a></li>
                    </ul>
                  </li>
                </ul>
              `;
            }
            if (globalstate.user.tipo === 'Administrador') {
              html += `
                <ul class="navbar-nav">
                  <li class="nav-item">
                    <a class="nav-link" id="clientes" href="#"><i class="fas fa-users"></i> Clientes</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id="coberturas" href="#"><i class="fas fa-list-ul"></i> Categorías y Coberturas</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id="vehiculos" href="#"><i class="fas fa-car"></i> Vehículos</a>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fas fa-user-cog"></i> Administrador
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li><a class="dropdown-item" id="logout2" href="#"><i class="fas fa-sign-out-alt"></i> Salir</a></li>
                    </ul>
                  </li>
                </ul>
              `;
            }
          }
        this.dom.querySelector('#app>#menu #menuItems').replaceChildren();
        this.dom.querySelector('#app>#menu #menuItems').innerHTML=html;
        this.dom.querySelector("#app>#menu #menuItems #polizas")?.addEventListener('click',e=>this.clienteShow());  
        this.dom.querySelector("#app>#menu #menuItems #login")?.addEventListener('click',e=>this.modal.show());  
        this.dom.querySelector("#app>#menu #menuItems #logout1")?.addEventListener('click',e=>this.logout());
        this.dom.querySelector("#app>#menu #menuItems #logout2")?.addEventListener('click',e=>this.logout());
        
        this.dom.querySelector("#app>#menu #menuItems #coberturas")?.addEventListener('click',e=>this.categoriaShow()); 
        this.dom.querySelector("#app>#menu #menuItems #clientes")?.addEventListener('click',e=>this.adminShow()); 
        this.dom.querySelector("#app>#menu #menuItems #vehiculos")?.addEventListener('click',e=>this.vehiculoShow()); 
        
        this.dom.querySelector("#app>#modal #register")?.addEventListener('click', e => {
          this.modal.hide();
          this.registerModal.show();
        }); 
    
        if(globalstate.user!==null){
            switch(globalstate.user.tipo){
                case 'Cliente':
                    this.dom.querySelector("#editProfile").addEventListener('click', this.editar);
                    this.clienteShow();
                    break;
                case 'Administrador':
                    this.admin.renderClientes();
                    this.adminShow();
                    break;
            }
        }
    }

    clienteShow=()=>{
        this.cliente.renderPolizas();
        this.dom.querySelector('#app>#body').replaceChildren(this.cliente.dom);
    }
    
    categoriaShow=()=>{
        this.categoria.loadCoberturas();
        this.dom.querySelector('#app>#body').replaceChildren(this.categoria.dom);
    }
    
    adminShow=()=>{
        this.admin.renderClientes();
        this.dom.querySelector('#app>#body').replaceChildren(this.admin.dom);
    }
    
    vehiculoShow=()=>{
        this.vehiculo.list();
        this.dom.querySelector('#app>#body').replaceChildren(this.vehiculo.dom);
    }
    
    login = async () => {
      const candidate = Object.fromEntries(new FormData(this.dom.querySelector("#form")).entries());

      const request = new Request(`${backend}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate)
      });

      try {
        const response = await fetch(request);
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message;
          this.showAlert3(errorMessage, 'danger');
          console.log("ERROR LOGIN");
          return;
        }
        console.log("OK LOGIN");
        const user = await response.json();
        globalstate.user = user;

        if (globalstate.user.tipo === 'Cliente') {
          // Solicitar datos del cliente
          const requestCliente = new Request(`${backend}/clientes`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });

          const responseCliente = await fetch(requestCliente);
          if (responseCliente.ok) {
            const cli = await responseCliente.json();
            globalstate.cliente = cli;
          } else {
            console.log("ERROR GET CLIENTE");
          }
        }

        this.modal.hide();
        this.renderMenuItems();
        this.clearLogin();
      } catch (error) {
        console.error(error);
        this.showAlert3('Error en el servidor', 'danger');
      }
    };
    
    logout= async ()=>{
        globalstate.user=null;
        globalstate.cliente=null;
        this.dom.querySelector('#app>#body').replaceChildren();
        this.renderBodyFiller();
        this.renderMenuItems();

        // Haz una petición DELETE al endpoint de logout
        const response = await fetch(`${backend}/login/logout`, {method: 'DELETE'});
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.clearLogin();
    }
    
    register = async () => {
        const formData = new FormData(this.dom.querySelector("#registerForm"));
        const tarjeta = {
          numero: formData.get("numeroTarjeta"),
          vencimiento: formData.get("vencimientoTarjeta"),
          cvc: formData.get("cvcTarjeta")
        };

        const cliente = {
          usuario: formData.get("usuario"),
          contraseña: formData.get("contrasena"),
          cedula: formData.get("cedula"),
          nombre: formData.get("nombre"),
          telefono: formData.get("telefono"),
          correo: formData.get("correo"),
          tarjetas: [tarjeta]
        };

        if (!isNumeric(cliente.cedula)) {
          this.showAlert("El campo de cédula solo permite números.", "danger");
          return;
        }
        if (!isNumeric(cliente.telefono)) {
          this.showAlert("El campo de teléfono solo permite números.", "danger");
          return;
        }
        if (!isNumeric(tarjeta.numero)) {
          this.showAlert("El campo de número de tarjeta solo permite números.", "danger");
          return;
        }
        if (!isNumeric(tarjeta.cvc)) {
          this.showAlert("El campo de CVC solo permite números.", "danger");
          return;
        }

        const request = new Request(`${backend}/clientes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cliente)
        });

        try {
          const response = await fetch(request);
          if (!response.ok) {
            const errorMessage = await response.text();
            if (errorMessage === "Este nombre de usuario ya existe.") {
              this.showAlert(errorMessage, "danger");
            } else if (errorMessage === "Esta cédula ya se encuentra asociada a otra cuenta.") {
              this.showAlert(errorMessage, "danger");
            } else {
              this.showAlert(`Falló la conexión con el servidor.`, "danger");
            }
            return;
          }
          console.log("register OK");
          this.registerModal.hide();
          this.modal.show();
          this.clearRegister();
        } catch (error) {
          this.showAlert(error, "danger");
        }
      }
      
    renderEditModal = () => {
        return `
          <div class="modal" tabindex="-1" id="editModal">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Editar Perfil</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modalBody">
                </div>
              </div>
            </div>
          </div>
        `;
    }
      
    renderEditData = () => {
        const user = globalstate.cliente;
        return `
          <form id="editForm">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="nombreE" value="${user.nombre}">
            </div>
            <div class="mb-3">
              <label for="contraseña" class="form-label">Contraseña</label>
              <input type="text" class="form-control" id="contraseñaE" value="${user.contraseña}">
            </div>
            <div class="mb-3">
              <label for="correo" class="form-label">Correo</label>
              <input type="email" class="form-control" id="correoE" value="${user.correo}">
            </div>
            <div class="mb-3">
              <label for="tarjeta" class="form-label">Tarjeta</label>
              <input type="text" class="form-control" id="tarjetaE" value="${user.tarjetas[0].numero}">
            </div>
            <div class="mb-3">
              <label for="fecha_vencimiento" class="form-label">Fecha de vencimiento</label>
              <input type="text" class="form-control" id="fecha_vencimientoE" value="${user.tarjetas[0].vencimiento}">
            </div>
            <div class="mb-3">
              <label for="cvc" class="form-label">CVC</label>
              <input type="text" class="form-control" id="cvcE" value="${user.tarjetas[0].cvc}">
            </div<div class="modal-footer">
            <br>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="saveChanges">Guardar Cambios</button>
            </div>
          </form>
        `;
      }

    editar = () => {
        const modalBody = this.dom.querySelector('#modalBody');
        modalBody.innerHTML = this.renderEditData();
        this.dom.querySelector('#saveChanges').addEventListener('click', this.guardarCambios);
        this.editModal.show();
    }

    guardarCambios = async () => {
      const user = globalstate.cliente;
      const nombreInput = this.dom.querySelector('#nombreE');
      const correoInput = this.dom.querySelector('#correoE');
      const contraseñaInput = this.dom.querySelector('#contraseñaE');
      const tarjetaInput = this.dom.querySelector('#tarjetaE');
      const fechaVencimientoInput = this.dom.querySelector('#fecha_vencimientoE');
      const cvcInput = this.dom.querySelector('#cvcE');

      if (nombreInput.value.trim() === '') {
        this.showAlert2('El campo Nombre no puede estar vacío.', 'danger');
        return;
      }

      if (correoInput.value.trim() === '') {
        this.showAlert2('El campo Correo no puede estar vacío.', 'danger');
        return;
      }

      if (contraseñaInput.value.trim() === '') {
        this.showAlert2('El campo Contraseña no puede estar vacío.', 'danger');
        return;
      }

      if (tarjetaInput.value.trim() === '') {
        this.showAlert2('El campo Tarjeta no puede estar vacío.', 'danger');
        return;
      }

      if (fechaVencimientoInput.value.trim() === '') {
        this.showAlert2('El campo Fecha de vencimiento no puede estar vacío.', 'danger');
        return;
      }

      if (cvcInput.value.trim() === '') {
        this.showAlert2('El campo CVC no puede estar vacío.', 'danger');
        return;
      }

      const isNumber = (value) => /^\d+$/.test(value);

      const isValidDate = (value) => /^\d{4}-\d{2}$/.test(value);

      if (!isNumber(tarjetaInput.value)) {
        this.showAlert2('El número de tarjeta debe ser un valor numérico.', 'danger');
        return;
      }

      if (!isValidDate(fechaVencimientoInput.value)) {
        this.showAlert2('La fecha de vencimiento debe tener el formato válido (año-mes).', 'danger');
        return;
      }

      if (contraseñaInput.value.length < 0) {
        this.showAlert2('La contraseña debe tener al menos 6 caracteres.', 'danger');
        return;
      }

      if (!isNumber(cvcInput.value)) {
        this.showAlert2('El CVC debe ser un valor numérico.', 'danger');
        return;
      }

      user.nombre = nombreInput.value;
      user.correo = correoInput.value;
      user.contraseña = contraseñaInput.value;
      user.tarjetas[0].numero = tarjetaInput.value;
      user.tarjetas[0].vencimiento = fechaVencimientoInput.value;
      user.tarjetas[0].cvc = cvcInput.value;

      // Realizar la solicitud de actualización del cliente
      const request = new Request(`${backend}/clientes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      try {
        const response = await fetch(request);
        if (!response.ok) {
          const errorMessage = await response.text();
          this.showAlert2(`Error al guardar cambios: ${errorMessage}`, 'danger');
          return;
        }

        // Actualización exitosa
        globalstate.cliente=user;
        globalstate.user = {
            usuario: user.usuario,
            contraseña: user.contraseña,
            tipo: 'Cliente'
        };
        this.editModal.hide();
      } catch (error) {
        this.showAlert2('Error al guardar cambios', 'danger');
        console.error(error);
      }
    };

      showAlert = (message, type) => {
          const alertElement = document.createElement("div");
          alertElement.classList.add("alert", `alert-${type}`);
          alertElement.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          `;

          const alertContainer = this.dom.querySelector("#registerModal .modal-body");
          alertContainer.appendChild(alertElement);
      }
  
    showAlert2 = (message, type) => {
      const alertElement = document.createElement("div");
      alertElement.classList.add("alert", `alert-${type}`);
      alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

      const alertContainer = this.dom.querySelector("#editModal .modal-body");
      alertContainer.appendChild(alertElement);
    }
    
    showAlert3 = (message, type) => {
      const alertElement = document.createElement("div");
      alertElement.classList.add("alert", `alert-${type}`);
      alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

      const alertContainer = this.dom.querySelector("#modal .modal-body");
      alertContainer.appendChild(alertElement);
    };
    
    reset =()=>{
        this.state.entity = this.emptyEntity();   
    }
    
    clearLogin = ()=>{
        this.dom.querySelector('#form #usuario').value = '';
        this.dom.querySelector('#form #contraseña').value = '';
    }
    
    clearRegister = () =>{
        this.dom.querySelector("#registerForm #numeroTarjeta").value = '';
        this.dom.querySelector("#registerForm #vencimientoTarjeta").value = '';
        this.dom.querySelector("#registerForm #cvcTarjeta").value = '';

        this.dom.querySelector("#registerForm #usuario").value = '';
        this.dom.querySelector("#registerForm #contrasena").value = '';
        this.dom.querySelector("#registerForm #cedula").value = '';
        this.dom.querySelector("#registerForm #nombre").value = '';
        this.dom.querySelector("#registerForm #telefono").value = '';
        this.dom.querySelector("#registerForm #correo").value = '';
    }
}
      
function isNumeric(value) {
  return /^\d+$/.test(value);
}
