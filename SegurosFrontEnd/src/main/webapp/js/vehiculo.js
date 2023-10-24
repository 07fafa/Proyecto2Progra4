class Vehiculo{
    dom;
    modal;

    state;

    constructor() {
        this.state = { 'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A' };
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#vehiculoModal'));
        this.dom.querySelector("#create").addEventListener('click', this.makenew);        
        this.dom.querySelector('#apply').addEventListener('click', this.add);
    }

    render = () => {
        const html = `
          ${this.renderList()}
          ${this.renderModal()}    
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'vehiculos';
        rootContent.innerHTML = html;

        rootContent.querySelector("#search").addEventListener('click', this.search);

        return rootContent;
    }

    renderList = () => {
        return `
          <div class="container mt-5">
            <div class="row">
              <div class="col-md-6">
                <div class="input-group mb-3">
                  <input type="text" class="form-control" placeholder="Modelo" id="modelo">
                  <button class="btn btn-primary btn-orange" type="button" id="search">Search</button>
                </div>
              </div>
              <div class="col-md-6 text-end">
                <button class="btn btn-primary btn-circle btn-orange" id="create" data-bs-toggle="modal" data-bs-target="#vehiculoModal">
                  <i class="fas fa-plus"></i>
                </button>       
              </div>
            </div>

            <div class="table-container" style="height: 500px; overflow-y: scroll;">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Vehiculo</th>
                  </tr>
                </thead>
                <tbody id="vehiculosTableBody">
                </tbody>
              </table>
            </div>
          </div>
        `;
    }
    
    renderModal = () => {
      const modalHTML = `
        <div id="vehiculoModal" class="modal fade" tabindex="-1">
        <div id="alertContainer"></div>
          <div class="modal-dialog">
            <div class="modal-content bg-dark text-light">
              <div class="modal-header">
                <img class="img-circle" id="img_logo" src="images/logo.png" style="max-width: 50px; max-height: 50px" alt="logo">
                <h5 class="modal-title ml-4">Vehiculo</h5>
                <button type="button" class="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="tab-content mt-3">
                  <div class="tab-pane fade show active" id="datosBasicos" role="tabpanel" aria-labelledby="datosBasicosTab">
                        <form>
                          <div class="mb-3">
                            <label for="marca" class="form-label">Marca</label>
                            <input type="text" class="form-control required-input" id="modal-marca" required>
                          </div>
                          <div class="mb-3">
                            <label for="modelo" class="form-label">Modelo</label>
                            <input type="text" class="form-control required-input" id="modal-modelo" required>
                          </div>
                          <div class="mb-3">
                            <label for="imagen" class="form-label">Imagen</label>
                           <input type="file" class="form-control" id="imagen" name="imagen" required>
                          </div>
                        </form>
                  </div>
                </div>                  
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button id="apply" type="button" class="btn btn-primary">Aplicar</button>
              </div>
            </div>
          </div>
        </div>
      `;
      return modalHTML;
    };

    showModal= async ()=>{
        this.modal.show();

    }

    load=()=>{
        //Save modal form data into entity
        const marca = this.dom.querySelector('#modal-marca').value;
        const modelo = this.dom.querySelector('#modal-modelo').value;
        this.state.entity = {
            marca,
            modelo
        };
    }

    reset = () => {
    this.state.entity = this.emptyEntity();
    this.dom.querySelector('#modal-marca').value = '';
    this.dom.querySelector('#modal-modelo').value = '';
    this.dom.querySelector('#imagen').value = '';
    const alertContainer = this.dom.querySelector('#alertContainer');
    alertContainer.innerHTML = '';
}

    emptyEntity=()=>{
       return {
        marca: '',
        modelo: ''        
      };
    }
    
    add = async () => {
      this.load();

      // Validar que todos los campos estén completos
      if (!this.validateFields()) {
        this.showErrorMessage("Por favor, complete todos los campos y suba una imagen.");
        return;
      }

      // Validar que no exista un vehículo con la misma marca y modelo
      if (this.isDuplicateVehicle()) {
        this.showErrorMessage("Ya existe un vehículo con la misma marca y modelo.");
        return;
      }

      const request = new Request(backend + '/vehiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state.entity)
      });

      try {
        const response = await fetch(request);
        if (!response.ok) {
          errorMessage("Falló la conexión con el servidor.");
          return;
        }

        await this.addImagen();
      } catch (error) {
        console.error(error);
        alert("Error al agregar el vehículo.");
        return;
      }

      this.list();
      this.reset();
      this.modal.hide();
    }
    
    addImagen = async () => {
      const imagenInput = this.dom.querySelector('#imagen');
      const imagenFile = imagenInput.files[0];

      var data = new FormData();
      data.append("imagen", imagenFile);

      let request = new Request(`${backend}/vehiculos/${this.state.entity.marca}-${this.state.entity.modelo}/imagen`, { method: 'POST', body: data });
      const response = await fetch(request);
      if (!response.ok) {
        alert("Error al subir la imagen");
        return;
      }
    }
    
    isDuplicateVehicle = () => {
      const { marca, modelo } = this.state.entity;
      return this.state.entities.some(entity => entity.marca === marca && entity.modelo === modelo);
    }
    
    validateFields = () => {
      const marcaInput = this.dom.querySelector('#modal-marca');
      const modeloInput = this.dom.querySelector('#modal-modelo');
      const imagenInput = this.dom.querySelector('#imagen');

      if (!marcaInput.value || !modeloInput.value || !imagenInput.files[0]) {
        return false;
      }

      return true;
    }

    update=()=>{
    // Validate data, load into entity, invoque backend for updating    
    this.list();
    this.reset();
    this.modal.hide();
    }

    list=()=>{
        const request = new Request(`${backend}/vehiculos`, {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage("Falló la conexión con el servidor.");return;}
        var vehiculos = await response.json();
        this.state.entities = vehiculos;
        var listing=this.dom.querySelector("#vehiculosTableBody");
        listing.innerHTML="";
        this.state.entities.forEach( e=>this.row(listing,e));         
    })(); 
    }
    
    row=(list,v)=>{
        var tr =document.createElement("tr");
        tr.innerHTML=`
                <td>${v.marca}</td>
                <td>${v.modelo}</td>
                <td><img class="imagen" src="${backend}/vehiculos/${v.marca}-${v.modelo}/imagen" style="display: block; max-width: 200px; max-height: 200px;"></td>`;              
        list.append(tr);           
    }

    makenew=()=>{
      this.reset();
      this.state.mode='A'; //adding
      this.showModal();
    }

    search = () => {
        const modelo = this.dom.querySelector('#modelo').value;

        const filteredEntities = this.state.entities.filter(entity => entity.modelo.toLowerCase().includes(modelo.toLowerCase()));

        const listing = this.dom.querySelector("#vehiculosTableBody");
        listing.innerHTML = "";
        filteredEntities.forEach(entity => this.row(listing, entity));
    }  
    
    cancel = () => {
        setTimeout(() => {
            this.modal = new bootstrap.Modal(this.dom.querySelector('#vehiculoModal'));
            this.modal.show();
        }, 500); 
    }
    
    showErrorMessage = (message) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'alert alert-danger';
      messageDiv.role = 'alert';
      messageDiv.textContent = message;

      const alertContainer = this.dom.querySelector('#alertContainer');
      alertContainer.innerHTML = '';
      alertContainer.appendChild(messageDiv);

      setTimeout(() => {
        messageDiv.remove();
      }, 3000);
    }
}

