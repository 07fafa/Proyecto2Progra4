class Admin {
  dom;
  modal;

  state;

  constructor() {
    this.state = { 'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A' };
    this.dom = this.render();
    this.dom.querySelector("#search").addEventListener('click', this.search);
  }

  render = () => {
    const html = `
      ${this.renderList()}
      ${this.renderModalDetails()}
    `;
    var rootContent = document.createElement('div');
    rootContent.id = 'clientes';
    rootContent.innerHTML = html;
    return rootContent;
  }

    renderList = () => {
        return `
          <div class="container mt-5">
            <div class="row">
              <div class="col-md-6">
                <div class="input-group mb-3">
                  <input id="id" type="text" class="form-control" placeholder="Cédula del Cliente">
                  <button class="btn btn-primary btn-orange" type="button" id="search">Search</button>
                </div>
              </div>
            </div>

            <div class="table-container" style="height: 500px; overflow-y: scroll;">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Cedula</th>
                    <th>Nombre</th>
                    <th>Telefono</th>
                    <th>Correo</th>
                    <th>Polizas</th>
                  </tr>
                </thead>
                <tbody id="clientesTableBody">
                </tbody>
              </table>
            </div>
          </div>
        `;
    }
  
  renderModalDetails = () => {
      return `
        <div id="detailsModal" class="modal fade" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Detalles de las Pólizas del Cliente</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div id="modal-details-content" class="modal-body">
                <!-- Aquí es donde se insertarán los detalles de la póliza -->
              </div>
            </div>
          </div>
        </div>
      `;
    };

  renderClientes = async () => {
    try {
      const response = await fetch(`${backend}/clientes/all`);
      if (!response.ok) {
        errorMessage("Falló la conexión con el servidor.");
        console.log("ERROR RENDER CLIENTES");
        return;
      }
      const clientes = await response.json();
      this.state.clientes = clientes;
      this.renderClientesTable(clientes);
    } catch (error) {
      console.error(error);
    }
  }

  renderClientesTable = (clis) => {
  const tableBody = this.dom.querySelector('#clientesTableBody');
  tableBody.innerHTML = '';

  clis.forEach((c) => {
    const row = document.createElement('tr');
    const buttonId = `detalle-${c.cedula}`;
    row.innerHTML = `
      <td>${c.cedula}</td>
      <td>${c.nombre}</td>
      <td>${c.telefono}</td>
      <td>${c.correo}</td>
      <td><button id="${buttonId}" class="btn btn-primary btn-sm" data-id="${c.cedula}"><i class="fas fa-search"></i></button></td>           
    `;
    const button = row.querySelector('button');
    button.addEventListener('click', () => this.mostrarDetallesPoliza(c)); // Envuelve la llamada en una función anónima

    tableBody.appendChild(row);
  });
}
  
  mostrarDetallesPoliza = async (c) => {
      try {
        const response = await fetch(`${backend}/polizas/clientep/${c.usuario}`);
        if (!response.ok) {
          errorMessage(response.status);
          console.log("ERROR RENDER POLIZAS");
          return;
        }
        const polizas = await response.json();

        polizas.forEach((poliza, index) => {
          poliza.id = index + 1; 
        });

        this.state.polizas = polizas;
        const details = await this.renderDetails(polizas);
        const modalContent = this.dom.querySelector('#modal-details-content');
          
        modalContent.innerHTML = details;
        const detailsModal = new bootstrap.Modal(this.dom.querySelector('#detailsModal'));

          detailsModal.show()
      } catch (error) {
        console.error(error);
      }
    }
    
    renderDetails = async (polizas) => {
      if (polizas.length === 0) {
        return '<p>El cliente no ha comprado ninguna póliza.</p>';
      }

      let details = '';
      let polizaCount = 1;

      for (const poliza of polizas) {
        const marca = poliza.vehiculo?.marca || 'N/A';
        const modelo = poliza.vehiculo?.modelo || 'N/A';

        // Total cost calculation
        let totalCost = 0;
        if (poliza.coberturas && poliza.coberturas.length > 0) {
          poliza.coberturas.forEach(cobertura => {
            const { costoMinimo, costoPorcentual } = cobertura;
            const costPercentualApplied = costoPorcentual * poliza.valor;
            const coverageCost = Math.max(costoMinimo, costPercentualApplied);
            totalCost += coverageCost;
          });
        }

        // Format total cost to two decimal places
        const formattedTotalCost = totalCost.toFixed(2);

        details += `
          <div class="container">
            <div class="row">
              <div class="col-6"><strong>Número de póliza:</strong></div>
              <div class="col-6">${polizaCount}</div>
            </div>
            <div class="row">
              <div class="col-6"><strong>Número de placa:</strong></div>
              <div class="col-6">${poliza.numero}</div>
            </div>
            <div class="row">
              <div class="col-6"><strong>Año:</strong></div>
              <div class="col-6">${poliza.año}</div>
            </div>
            <div class="row">
              <div class="col-6"><strong>Marca del Vehículo:</strong></div>
              <div class="col-6">${marca}</div>
            </div>
            <div class="row">
              <div class="col-6"><strong>Modelo del Vehículo:</strong></div>
              <div class="col-6">${modelo}</div>
            </div>
            <div class="row">
              <div class="col-6"><strong>Valor:</strong></div>
              <div class="col-6">₡${poliza.valor}</div>
            </div>
            <div class="row">
              <div class="col-6"><strong>Plazo:</strong></div>
              <div class="col-6">${poliza.plazo}</div>
            </div>
            <div class="row mt-3">
              <div class="col-12">
                <h5>Coberturas Aplicadas:</h5>
                <ul>
                  ${poliza.coberturas?.map(cobertura => `<li>${cobertura.categoria.descripcion} - ${cobertura.descripcion}.</li>`).join('')}
                </ul>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12">
                <h5>Costo Total:</h5>
                ₡${formattedTotalCost}
              </div>
            </div>
          </div>
          <hr>
        `;

        polizaCount++;
      }

      return details;
    };

  emptyEntity = () => {
    // Aquí debes definir y devolver una entidad vacía según tu lógica de negocio
  }

search = async () => {
  try {
    const input = this.dom.querySelector('#id');
    const searchTerm = input.value.trim();

    if (searchTerm === "") {
      // Si el término de búsqueda está vacío, renderizar todos los clientes
      this.renderClientesTable(this.state.clientes);
      return;
    }

    const filteredClientes = this.state.clientes.filter((cliente) => {
      // Verificar si el cliente tiene el campo 'id' y si contiene el término de búsqueda
      if (cliente.cedula && cliente.cedula.includes(searchTerm)) {
        return true;
      }
      return false;
    });

    // Actualizar el estado y renderizar la tabla de clientes con los resultados de búsqueda
    this.renderClientesTable(filteredClientes);
  } catch (error) {
    console.error(error);
  }
}





}

