class Categoria {
  dom;
  modal;

  state;

  constructor() {
    this.state = { entities: [], entity: this.emptyEntity(), mode: 'A' };
    this.dom = this.render();
    this.modal = new bootstrap.Modal(this.dom.querySelector('#categoriaModal'));
    this.dom.querySelector("#create").addEventListener('click', this.makenew);
    this.dom.querySelector("#search").addEventListener('click', this.search);
    this.dom.querySelector('#apply').addEventListener('click', this.add);
    this.dom.querySelector('#applyCobertura').addEventListener('click', this.addCobertura);
  }

  render = () => {
    const html = `
      ${this.renderList()}
      ${this.renderModal()}    
    `;
    const rootContent = document.createElement('div');
    rootContent.id = 'categorias';
    rootContent.innerHTML = html;
    return rootContent;
  }

    renderList = () => {
      return `
        <div class="container mt-5">
          <div class="row">
            <div class="col-md-6">
              <div class="input-group mb-3">
                <input type="text" id="searchDescripcion" class="form-control" placeholder="Descripción de la categoría">
                <button class="btn btn-primary btn-orange" type="button" id="search">Search</button>
              </div>
            </div>
            <div class="col-md-6 text-end">
              <button class="btn btn-primary btn-circle btn-orange" id="create" data-bs-toggle="modal" data-bs-target="#categoriaModal">
                <i class="fas fa-plus"></i>
              </button>       
            </div>
          </div>

          <div class="table-responsive" style="height: 500px; overflow-y: auto;">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID Categoría</th>
                  <th>Descripción</th>
                  <th>Coberturas específicas</th>
                </tr>
              </thead>
              <tbody id="categoriasTableBody">
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    renderModal = () => {
      const modalHTML = `
        <div id="categoriaModal" class="modal fade" tabindex="-1">
        <div id="alertContainer"></div>
          <div class="modal-dialog">
            <div class="modal-content bg-dark text-light">
              <div class="modal-header">
                <img class="img-circle" id="img_logo" src="images/logo.png" style="max-width: 50px; max-height: 50px" alt="logo">
                <h5 class="modal-title ml-4">Categoria</h5>
                <button type="button" class="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <ul class="nav nav-tabs mb-3" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="categoria-tab" data-bs-toggle="tab" data-bs-target="#categoria" type="button" role="tab" aria-controls="categoria" aria-selected="true">Categoría</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="cobertura-tab" data-bs-toggle="tab" data-bs-target="#cobertura" type="button" role="tab" aria-controls="cobertura" aria-selected="false">Cobertura</button>
                  </li>
                </ul>
                <div class="tab-content mt-3">
                  <div class="tab-pane fade show active" id="categoria" role="tabpanel" aria-labelledby="categoria-tab">
                    <h2 class="mb-3">Agregar nueva categoría</h2>
                    <form>
                      <div class="mb-3">
                        <label for="descripcion" class="form-label">Descripción</label>
                        <input type="text" class="form-control required-input" id="descripcion" required>
                      </div>
                      <button id="apply" type="button" class="btn btn-primary">Aplicar</button>
                    </form>
                  </div>
                  <div class="tab-pane fade" id="cobertura" role="tabpanel" aria-labelledby="cobertura-tab">
                    <h2 class="mb-3">Agregar nueva cobertura</h2>
                    <form id="coberForm">
                      <div class="mb-3">
                        <label for="categorias" class="form-label">Categoría</label>
                        <select class="form-select required-input" id="categorias" required >
                          <option value="">Seleccione...</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label for="nombreCobertura" class="form-label">Nombre de la cobertura</label>
                        <input type="text" class="form-control required-input" id="nombreCobertura" required placeholder="Nombre descriptivo de la nueva cobertura.">
                      </div>
                      <div class="mb-3">
                        <label for="costoMinimo" class="form-label">Costo mínimo</label>
                        <input type="number" step="0.01" class="form-control required-input" id="costoMinimo" required placeholder="Precio mínimo en colones">
                      </div>
                      <div class="mb-3">
                        <label for="costoPorcentual" class="form-label">Costo porcentual</label>
                        <input type="number" step="0.01" class="form-control required-input" id="costoPorcentual" required placeholder="Valor decimal de 0.1 a 0.9">
                      </div>
                      <button id="applyCobertura" type="button" class="btn btn-primary">Aplicar</button>
                    </form>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      `;
      return modalHTML;
    }

  emptyEntity = () => {
    return { identificacion: '', descripcion: '', coberturas: [] };
  }

  renderForm = () => {
    this.dom.querySelector('#descripcion').value = this.state.entity.descripcion;
  }

  gatherCategoriaData = () => {
    return { descripcion: this.dom.querySelector('#descripcion').value };
  }

    gatherCoberturaData = () => {
      const descripcion = this.dom.querySelector('#nombreCobertura').value;
      const costoMinimo = this.dom.querySelector('#costoMinimo').value;
      const costoPorcentual = this.dom.querySelector('#costoPorcentual').value;
      const identificacion = '';

      const categoriaSelect = this.dom.querySelector('#categorias');
      const categoriaDescripcion = categoriaSelect.options[categoriaSelect.selectedIndex].value;

      const categoria = this.state.categorias.find(
        (categoria) => categoria.descripcion === categoriaDescripcion
      );

      return {
        identificacion,
        descripcion,
        costoMinimo,
        costoPorcentual,
        categoria
      };
    }

    createCategoria = async () => {
      const data = this.gatherCategoriaData();

      const request = new Request(backend + '/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      try {
        const response = await fetch(request);
        if (!response.ok) {
          const errorMessage = await response.text();
          this.showErrorMessage(errorMessage);
          console.log("ERROR CREATE CATEGORIA");
          return;
        }
        console.log("OK CREATE CATEGORIA");


        this.modal.hide();
        this.loadCoberturas();
        this.reset();
      } catch (error) {
        console.error(error);
      }
    }

  // Método para crear una nueva cobertura
  createCobertura = async () => {
    const cobert = this.gatherCoberturaData();

    const request = new Request(`${backend}/coberturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cobert)
    });

    try {
      const response = await fetch(request);
      if (!response.ok) {
        const errorMessage = await response.text();
        this.showErrorMessage(errorMessage);
        console.log("ERROR CREATE COBERTURA");
        return;
      }
      console.log("OK CREATE COBERTURA");

      this.loadCoberturas();
      this.modal.hide();
      this.reset();
    } catch (error) {
      console.error(error);
    }
  }

    renderCategorias = async () => {
      const request = new Request(`${backend}/categorias`, { method: 'GET', headers: {} });
      try {
        const response = await fetch(request);
        if (!response.ok) {
          errorMessage("Falló la conexión con el servidor.");
          return;
        }
        console.log("OK LOADING Categorias");
        const categorias = await response.json();
        this.state.categorias = categorias;

        const categoriasSelect = this.dom.querySelector('#categorias');
        categoriasSelect.innerHTML = '<option value="">Seleccione...</option>';

        categorias.forEach(categoria => {
          categoriasSelect.innerHTML += `<option value="${categoria.descripcion}">${categoria.descripcion}</option>`;
        });

      } catch (error) {
        console.error(error);
      }
    };

    loadCoberturas = async () => {
      const requestCategorias = new Request(`${backend}/categorias`, { method: 'GET', headers: {} });
      const requestCoberturas = new Request(`${backend}/coberturas`, { method: 'GET', headers: {} });

      try {
        const responseCategorias = await fetch(requestCategorias);
        const responseCoberturas = await fetch(requestCoberturas);

        if (!responseCategorias.ok || !responseCoberturas.ok) {
          errorMessage("Falló la conexión con el servidor.");
          return;
        }

        console.log("OK LOADING CATEGORIAS Y COBERTURAS");

        const categorias = await responseCategorias.json();
        const coberturas = await responseCoberturas.json();

        const categoriasMap = new Map();

        categorias.forEach(categoria => {
          categoriasMap.set(categoria.descripcion, { identificacion: categoria.identificacion, descripcion: categoria.descripcion, coberturas: [] });
        });

        coberturas.forEach(cobertura => {
          const categoria = cobertura.categoria;

          if (categoriasMap.has(categoria.descripcion)) {
            categoriasMap.get(categoria.descripcion).coberturas.push(cobertura);
          }
        });

        this.state.categorias = Array.from(categoriasMap.values());
        this.state.coberturas = coberturas;

        this.renderCategorias();
        this.renderCategoriasTable(coberturas);
      } catch (error) {
        console.error(error);
      }
    }

      renderCategoriasTable = (coberturas) => {
      const tableBody = this.dom.querySelector('#categoriasTableBody');
      tableBody.innerHTML = '';

      const categoriasMap = new Map();

      this.state.categorias.forEach((categoria) => {
        categoriasMap.set(categoria.descripcion, { identificacion: categoria.identificacion, descripcion: categoria.descripcion, coberturas: [] });
      });

      coberturas.forEach((cobertura) => {
        const categoria = cobertura.categoria;

        if (categoriasMap.has(categoria.descripcion)) {
          categoriasMap.get(categoria.descripcion).coberturas.push(cobertura);
        }
      });

      categoriasMap.forEach((categoria) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${categoria.identificacion}</td>
          <td>${categoria.descripcion}</td>
          <td>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID Cobertura</th>
                  <th>Descripción</th>
                  <th>Costo mínimo</th>
                  <th>Costo porcentual</th>
                </tr>
              </thead>
              <tbody>
                ${categoria.coberturas.map((cobertura) => `
                  <tr>
                    <td>${cobertura.identificacion}</td>
                    <td>${cobertura.descripcion}</td>
                    <td>${cobertura.costoMinimo}</td>
                    <td>${cobertura.costoPorcentual}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }

    checkFormCategoria = () => {
        const descripcion = this.dom.querySelector('#descripcion').value;

        // Retornar verdadero si todos los campos están llenos
        return descripcion !== '';
    }

    checkFormCobertura = () => {
      const descripcion = this.dom.querySelector('#nombreCobertura').value;
      const costoMinimo = this.dom.querySelector('#costoMinimo').value;
      const costoPorcentual = parseFloat(this.dom.querySelector('#costoPorcentual').value);

      // Retornar verdadero si todos los campos están llenos y costoPorcentual es un número válido entre 0.1 y 0.9
      return (
        descripcion !== '' &&
        costoMinimo !== '' &&
        !isNaN(costoPorcentual) &&
        costoPorcentual >= 0.1 &&
        costoPorcentual <= 0.9
      );
    }

  makenew = () => {
    this.reset();
    this.state.mode = 'A';
    this.renderForm();
  }

    search = () => {
      const descripcion = this.dom.querySelector("#searchDescripcion").value.trim().toLowerCase();
      this.renderCategorias();

      if (descripcion === "") {
        // Si no se ha ingresado ninguna descripción, se cargan todas las categorías y coberturas nuevamente
        this.loadCoberturas();
      } else {
        // Filtrar las categorías y coberturas según la descripción ingresada
        const x = this.state.categorias;
        const filteredCategorias = this.state.categorias.filter(
          (categoria) =>
            categoria.descripcion.toLowerCase().includes(descripcion)
        );
        this.state.categorias=filteredCategorias;
        const filteredCoberturas = this.state.coberturas.filter(
          (cobertura) =>
            cobertura.categoria.descripcion.toLowerCase().includes(descripcion)
        );

        // Renderizar la tabla con las categorías y coberturas filtradas
        this.renderCategoriasTable(filteredCoberturas);
      }
    };

    add = () => {
        // Verificar que todos los campos de la categoría estén llenos
        if (!this.checkFormCategoria()) {
          this.showErrorMessage("Por favor complete todos los campos antes de agregar una categoría.");
          return;
        }

        this.createCategoria();
        this.renderCategorias();
        this.reset();
      }

    addCobertura = () => {
      // Verificar que todos los campos de la cobertura estén llenos
      if (!this.checkFormCobertura()) {
        this.showErrorMessage("Por favor ingrese datos válidos para agregar una cobertura.");
        return;
      }

      const categoriaSelect = this.dom.querySelector('#categorias');
      const categoriaDescripcion = categoriaSelect.options[categoriaSelect.selectedIndex].value;

      // Verificar si no se ha seleccionado ninguna categoría
      if (categoriaDescripcion === '') {
        this.showErrorMessage("Por favor seleccione una categoría antes de agregar una cobertura.");
        return;
      }

      this.createCobertura();
      this.clearCobertura();
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
    
    reset = () => {
    this.state.entity = this.emptyEntity();
    this.state.mode = 'A';
    this.renderForm();    
    
  }
    
    clearCobertura = () =>{
        this.dom.querySelector('#coberForm #descripcion').value = '';
        this.dom.querySelector('#coberForm #nombreCobertura').value = '';
        this.dom.querySelector('#coberForm #costoPorcentual').value = '';
        this.dom.querySelector('#coberForm #costoMinimo').value = '';

      // Agrega la lógica para limpiar los campos del formulario de la cobertura
        const categoriaSelect = this.dom.querySelector('#coberForm #categorias');
        categoriaSelect.selectedIndex = 0;
    }
}

