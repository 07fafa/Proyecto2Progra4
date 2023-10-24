class Cliente {
    dom;
    modal;

    state;

    constructor() {
        this.state = { 'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A' };
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#polizaModal'));
        this.cartModal = new bootstrap.Modal(this.dom.querySelector('#cartModal'));
        this.dom.querySelector("#search").addEventListener('click', this.search);
        this.dom.querySelector('#create').addEventListener('click', this.makenew);
        this.dom.querySelector('#siguienteBtn').addEventListener('click', this.validateAndProceed);
      }

    render = () => {
        const html = `
          ${this.renderList()}
          ${this.renderModal()}
          ${this.renderCartModal()}
          ${this.renderModalDetails()}
          ${this.renderToast()} 
        `;
        var rootContent = document.createElement('div');
        rootContent.id = 'cliente';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderList = () => {
      return `
        <div class="container mt-5">
          <div class="row">
            <div class="col-md-6">
              <div class="input-group mb-3">
                <input type="text" class="form-control" id="searchInput" placeholder="Número de placa">
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button" id="search">Search</button>
                </div>
              </div>
            </div>
            <div class="col-md-6 text-end">
              <button class="btn btn-primary" id="create" data-bs-toggle="modal" data-bs-target="#polizaModal">
                <i class="fas fa-plus"></i> Create
              </button>
            </div>
          </div>
          <div class="table-responsive" style="height: 500px; overflow-y: scroll;">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th scope="col">Número</th>
                  <th scope="col">Placa</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Auto</th>
                  <th scope="col"></th>
                  <th scope="col">Valor</th>
                  <th scope="col">Modo-Pago</th>
                  <th scope="col">Ver</th>
                </tr>
              </thead>
              <tbody id="polizasTableBody">
              </tbody>
            </table>
          </div>
        </div>
      `;
    };
    
    renderPolizas = async () => {
      try {
        const cliente = globalstate.cliente;
        const response = await fetch(`${backend}/polizas/cliente`);
        if (!response.ok) {
          errorMessage("Falló la conexión con el servidor.");
          console.log("ERROR RENDER POLIZAS");
          return;
        }
        const polizas = await response.json();

        polizas.forEach((poliza, index) => {
          poliza.id = index + 1; 
        });

        this.state.polizas = polizas;
        this.renderPolizasTable(polizas);
      } catch (error) {
        console.error(error);
      }
    }
    
    renderPolizasTable = (polizas) => {
      const tableBody = this.dom.querySelector('#polizasTableBody');
      tableBody.innerHTML = '';

      polizas.forEach((poliza) => {
        const row = document.createElement('tr');
        const buttonId = `detalle-${poliza.id}`;

        row.innerHTML = `
          <td>${poliza.id}</td>
          <td>${poliza.numero}</td>
          <td>${poliza.año}</td>
          <td>${poliza.vehiculo.marca} - ${poliza.vehiculo.modelo}</td>
          <td><img class="imagen" src="${backend}/vehiculos/${poliza.vehiculo.marca}-${poliza.vehiculo.modelo}/imagen" style="display: block; margin: 0 auto; max-width: 200px; max-height: 200px;"></td>
          <td>₡${poliza.valor}</td>
          <td>${poliza.plazo}</td>
          <td><button id="${buttonId}" class="btn btn-primary btn-sm" data-id="${poliza.id}"><i class="fas fa-search"></i></button></td>
        `;

        const button = row.querySelector('button');
        button.addEventListener('click', this.mostrarDetallesPoliza);

        tableBody.appendChild(row);
      });
    };

    renderModalDetails = () => {
      return `
        <div id="detailsModal" class="modal fade" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Detalles de la Póliza</h5>
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

    renderDetails = async (polizaId) => {
        const poliza = this.state.polizas.find(p => p.id === polizaId);

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

        return `
            <div class="container">
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
                    <div class="col-6">${poliza.vehiculo.marca}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Modelo del Vehículo:</strong></div>
                    <div class="col-6">${poliza.vehiculo.modelo}</div>
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
                        <h5>Coberturas:</h5>
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
        `;
    };

    mostrarDetallesPoliza = async (event) => {
        let target = event.target;
        // Si el usuario hizo clic en el icono dentro del botón, 
        // el target será el icono y necesitamos subir al botón.
        if (target.tagName !== 'BUTTON') {
            target = target.parentElement;
        }

        const polizaId = parseInt(target.dataset.id, 10);

        if (isNaN(polizaId)) {
            console.error('Invalid id:', target.dataset.id);
            return;
        }

        const details = await this.renderDetails(polizaId);

        const modalContent = this.dom.querySelector('#modal-details-content');
        modalContent.innerHTML = details;

        const detailsModal = new bootstrap.Modal(this.dom.querySelector('#detailsModal'));
        detailsModal.show();
    };

    renderModal = () => {
      const modalHTML = `
        <div id="polizaModal" class="modal fade" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content bg-dark text-light">
              <div class="modal-header">
                <img class="img-circle" id="img_logo" src="images/logo2.png" style="max-width: 50px; max-height: 50px" alt="logo">
                <h5 class="modal-title ml-4">Poliza</h5>
                <button type="button" class="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="datosBasicosTab" data-bs-toggle="tab" data-bs-target="#datosBasicos" type="button" role="tab" aria-controls="datosBasicos" aria-selected="true">Datos Básicos</button>
                    
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="coberturasTab" data-bs-toggle="tab" data-bs-target="#coberturas" type="button" role="tab" aria-controls="coberturas" aria-selected="false">Coberturas</button>
                  </li>
                </ul>
                <div class="tab-content mt-3">
                  <div class="tab-pane fade show active" id="datosBasicos" role="tabpanel" aria-labelledby="datosBasicosTab">
                    <form>
                      <div class="mb-3">
                        <label for="numeroPlaca" class="form-label">Número de Placa</label>
                        <input type="text" class="form-control required-input" id="numeroPlaca" required placeholder="Ingrese el número de placa">
                      </div>
                      <div class="mb-3">
                        <label for="anioVehiculo" class="form-label">Año del Vehículo</label>
                        <input type="text" class="form-control required-input" id="anioVehiculo" required pattern="^((188[6-9])|(18[9][0-9])|(19[0-9]{2})|(200[0-9])|(201[0-9])|(202[0-3]))$" title="Ingrese un año válido (entre 1886 y 2023)" placeholder="1886-2023">
                      </div>
                      <div class="mb-3">
                        <label for="marcaModelo" class="form-label">Marca-Modelo</label>
                        <select class="form-select required-input" id="marcaModelo" required>
                          <option value="">Seleccione...</option>
                          <!-- Opciones de marca y modelo aquí con renderVehiculos-->
                        </select>
                      </div>
                      <div class="mb-3">
                        <label for="valorVehiculo" class="form-label">Valor del Vehículo</label>
                        <input type="text" class="form-control required-input" id="valorVehiculo" required placeholder="Valor del vehículo en colones">
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Método de Pago</label>
                        <div class="form-check">
                          <input class="form-check-input required-input" type="radio" name="metodoPago" id="Trimestral" required>
                          <label class="form-check-label" for="Trimestral">Trimestral</label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input required-input" type="radio" name="metodoPago" id="Semestral" required>
                          <label class="form-check-label" for="Semestral">Semestral</label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input required-input" type="radio" name="metodoPago" id="Anual" required>
                          <label class="form-check-label" for="Anual">Anual</label>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="tab-pane fade" id="coberturas" role="tabpanel" aria-labelledby="coberturasTab">
                    <div class="scrollable" id="listaCoberturas">
                      <!-- Renderizar las categorías y sus coberturas en load -->
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button id="siguienteBtn" type="button" class="btn btn-primary">Siguiente</button>
              </div>
            </div>
          </div>
        </div>
      `;
      return modalHTML;
    };
      
    renderToast = () => {
        return `
          <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="alert" style="position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999;">
            <div class="toast-header">
              <strong class="me-auto">Alerta</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Asegurate de llenar todos los datos básicos con valores válidos, colocar un año válido (1886-actual) y seleccionar al menos una cobertura para tu Póliza.
            </div>
          </div>
        `;
    }
    
    validateAndProceed = async () => {
      const allInputsFilled = Array.from(this.dom.querySelectorAll('.required-input')).every(input => input.value.trim() !== '');
      const atLeastOneCoverageSelected = Array.from(this.dom.querySelectorAll('.coverage-input')).some(input => input.checked);
      const anioVehiculo = this.dom.querySelector('#anioVehiculo').value.trim();
      const validAnioVehiculo = anioVehiculo >= 1886 && anioVehiculo <= new Date().getFullYear();
      const valorVehiculo = this.dom.querySelector('#valorVehiculo').value.trim();
      const validValorVehiculo = !isNaN(valorVehiculo);

      if (!allInputsFilled || !validAnioVehiculo || !validValorVehiculo || !atLeastOneCoverageSelected) {
        const toastElement = new bootstrap.Toast(this.dom.querySelector('#alert'), {
          animation: true,
          delay: 2000
        });
        toastElement.show();
        return;
      }

      this.gatherPolizaData();
      this.showCart();
    };
      
    loadCoberturas = async () => {
        const request = new Request(`${backend}/coberturas`, { method: 'GET', headers: {} });

        try {
          const response = await fetch(request);
          if (!response.ok) {
            errorMessage("Falló la conexión con el servidor.");
            return;
          }
          console.log("OK LOADING COBERTURAS");
          const coberturas = await response.json();

          this.state.coberturas = coberturas;

          const categoriasMap = new Map(); 

          for(let i=0; i<coberturas.length; i++) {
            const cobertura = coberturas[i];
            const categoria = cobertura.categoria;

            if (!categoriasMap.has(categoria.descripcion)) {  
              categoriasMap.set(categoria.descripcion, { nombre: categoria.descripcion, coberturas: [] });  
            }

            categoriasMap.get(categoria.descripcion).coberturas.push(cobertura); 
          }

          this.state.categorias = Array.from(categoriasMap.values()); 

          const coberturasHTML = this.renderCoberturas();
          await this.loadVehiculos();
          this.dom.querySelector('#polizaModal .modal-body .scrollable').innerHTML = coberturasHTML;
          this.dom.querySelector('#marcaModelo').innerHTML = this.renderVehiculos();
          this.dom.addEventListener('input', this.validateForm);
          this.modal.show();
        } catch (error) {
          console.error(error);
        }
    }
    
    renderCoberturas = () => {
      let html = '';

      this.state.categorias.forEach(categoria => {
        html += `
          <div>
            <h4>${categoria.nombre}</h4>
        `;

        categoria.coberturas.forEach(cobertura => {
          html += `
            <div class="form-check">
              <input class="form-check-input coverage-input" type="checkbox" value="" id="${cobertura.descripcion}">
              <label class="form-check-label" for="${cobertura.descripcion}">
                ${cobertura.descripcion}
              </label>
            </div>
          `;
        });

        html += `<hr></div>`;
      });

      return html;
    };
    
    loadVehiculos = async () => {
        const request = new Request(`${backend}/vehiculos`, { method: 'GET', headers: {} });

        try {
            const response = await fetch(request);
            if (!response.ok) {
                errorMessage("Falló la conexión con el servidor.");
                return;
            }

            const vehiculos = await response.json();
            this.state.vehiculos = vehiculos;
            this.state.marcas = [...new Set(vehiculos.map(vehiculo => vehiculo.marca))];

        } catch (error) {
            console.error(error);
        }
    }
    
    renderVehiculos = () => {
      if(this.state.marcas.length === 0) {
        return `
          <option value="">No hay vehículos registrados en este momento</option>
        `;
      }

      let html = '<option value="">Seleccione...</option>';
      this.state.marcas.forEach(marca => {
        const modelos = this.state.vehiculos.filter(vehiculo => vehiculo.marca === marca).map(vehiculo => vehiculo.modelo);
        html += `<optgroup label="${marca}">`;
        modelos.forEach(modelo => {
          html += `<option value="${marca}-${modelo}">${marca} - ${modelo}</option>`;
        });
        html += `</optgroup>`;
      });

      return html;
    };

      showModal = async () => {
            await this.loadCoberturas();
      };

      reset = () => {
        this.state.entity = this.emptyEntity();
        this.dom.querySelector('#numeroPlaca').value = '';
        this.dom.querySelector('#anioVehiculo').value = '';
        this.dom.querySelector('#valorVehiculo').value = '';
        const metodoPagoInputs = Array.from(this.dom.querySelectorAll('input[name="metodoPago"]'));
        metodoPagoInputs.forEach(input => (input.checked = false));
    }

    emptyEntity = () => {
      return {
        numero: '',
        vehiculo: '',
        año: '',
        plazo: '',
        valor: '',
        coberturas: [],
        cliente: ''
      };
    }

    makenew = () => {
        this.reset();
        this.state.mode = 'A';
        this.showModal();
    }

    search = () => {
        const searchInput = this.dom.querySelector('#searchInput').value.toLowerCase();

        let filteredPolizas;
        if (searchInput === '') {
            filteredPolizas = this.state.polizas;
        } else {
            filteredPolizas = this.state.polizas.filter(poliza => {
                const { numero } = poliza;
                return numero.toLowerCase().includes(searchInput);
            });
        }

        this.renderPolizasTable(filteredPolizas);
    }

    
    gatherPolizaData = () => {
        const numero = this.dom.querySelector('#numeroPlaca').value;
        const marcaModelo = this.dom.querySelector('#marcaModelo').value.split('-');
        const marca = marcaModelo[0];
        const modelo = marcaModelo[1];
        const año = this.dom.querySelector('#anioVehiculo').value;
        const valor = this.dom.querySelector('#valorVehiculo').value;

        const plazoInputs = Array.from(this.dom.querySelectorAll('input[name="metodoPago"]'));
        const plazo = plazoInputs.find(input => input.checked)?.id || '';

        const coberturaInputs = Array.from(this.dom.querySelectorAll('.scrollable .form-check-input'));
        const coberturasDesc = coberturaInputs.filter(input => input.checked).map(input => input.id);

        const coberturas = coberturasDesc.map(desc => this.state.coberturas.find(cobertura => cobertura.descripcion === desc));

        const cliente = globalstate.cliente; 

        this.state.entity = {
            numero,
            vehiculo: {
                marca,
                modelo,
            },
            año,
            plazo,
            valor,
            coberturas,
            cliente
        };
    }


    showCart = () => {
        this.cartModal = new bootstrap.Modal(this.dom.querySelector('#cartModal'));
        this.dom.querySelector('#cartModal .cart-items').innerHTML = this.renderCartItems();
        this.dom.querySelector('#cartModal #pago').innerHTML = this.renderTotalCost();
        this.showCartModal();
    }
    
    showCartModal = () => {
        this.modal.hide();

        this.dom.querySelector('#cartModal').addEventListener('shown.bs.modal', () => {
            this.dom.querySelector('#cartModal .cart-items').innerHTML = this.renderCartItems();
            this.dom.querySelector('#cartModal #pago').innerHTML = this.renderTotalCost();
        });

        this.cartModal.show();

        this.dom.querySelector("#cartBuy").addEventListener('click', this.buy);
        this.dom.querySelector("#cartCancel").addEventListener('click', this.cancel);
    }
    
    renderTotalCost = () => {
        const poliza = this.state.entity;
        const { valor: valorVehiculo } = poliza;

        let totalCostHTML = '';
        let totalCost = 0;

        if (poliza.coberturas && poliza.coberturas.length > 0) {
            totalCostHTML += '<ol>';
            poliza.coberturas.forEach(cobertura => {
                const { costoMinimo, costoPorcentual } = cobertura;
                const costPercentualApplied = costoPorcentual * valorVehiculo;
                const coverageCost = Math.max(costoMinimo, costPercentualApplied);
                totalCost += coverageCost;

                totalCostHTML += `
                    <li>
                        <strong>Cobertura:</strong> ${cobertura.descripcion}<br>
                        <strong>Costo Mínimo:</strong> ₡${costoMinimo}<br>
                        <strong>Costo Porcentual:</strong> ${costoPorcentual * 100}%<br>
                        <strong>Costo Porcentual Aplicado al Valor del Vehículo:</strong> ₡${costPercentualApplied}<br>
                        <strong>Costo de Cobertura:</strong> ₡${coverageCost}<br>
                    </li>
                `;
            });
            totalCostHTML += `</ol>`;
            totalCostHTML += `<strong>Total: ₡${totalCost}</strong>`;
        } else {
            totalCostHTML = `<p>No se seleccionó ninguna cobertura.</p>`;
        }

        return totalCostHTML;
    }

    renderCartModal = () => {
        return `
          <div id="cartModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <i class="fas fa-shopping-cart mr-2"></i>
                  <h5 class="modal-title" style="margin-left:5px;">Confirmar Compra</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Items</button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Costo Total</button>
                    </li>
                  </ul>
                  <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                      <div class="cart-items">
                        <!-- renderCartItems -->
                      </div>
                    </div>
                    <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                      <div id="pago">
                        ${this.renderTotalCost()}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="cartCancel">Cancel</button>
                  <button type="button" class="btn btn-primary" id="cartBuy">Buy</button>
                </div>
              </div>
            </div>
          </div>
        `;
    }
    
    renderCartItems = () => {
      const poliza = this.state.entity;

      if (!poliza) {
        return `<p>No hay ningún artículo en el carrito</p>`;
      }

      let coberturasHTML = '';
      if (poliza.coberturas && poliza.coberturas.length > 0) {
        coberturasHTML += '<ol>';
        poliza.coberturas.forEach(cobertura => {
          coberturasHTML += `<li>${cobertura.descripcion}</li>`;
        });
        coberturasHTML += '</ol>';
      } else {
        coberturasHTML = `<p>No se seleccionó ninguna cobertura.</p>`;
      }

      return `
        <div class="accordion" id="polizaAccordion">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Datos de la Póliza
              </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#polizaAccordion">
              <div class="accordion-body">
                <div class="text-center">
                  <img class="imagen" src="${backend}/vehiculos/${poliza.vehiculo.marca}-${poliza.vehiculo.modelo}/imagen" alt="Imagen del Vehículo">
                </div>
                <br>
                <strong>Número de placa:</strong> ${poliza.numero}<br>
                <strong>Marca del Vehículo:</strong> ${poliza.vehiculo.marca}<br>
                <strong>Modelo del Vehículo:</strong> ${poliza.vehiculo.modelo}<br>
                <strong>Año del Vehículo:</strong> ${poliza.año}<br>
                <strong>Plazo de Pago:</strong> ${poliza.plazo}<br>
                <strong>Valor del Vehículo:</strong> ₡${poliza.valor}<br>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Coberturas
              </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#polizaAccordion">
              <div class="accordion-body">
                ${coberturasHTML}
              </div>
            </div>
          </div>
        </div>
      `;
    };

    buy = async () => {
      const poliza = this.state.entity;

      const request = new Request(`${backend}/polizas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poliza)
      });

      try {
        const response = await fetch(request);
        if (!response.ok) {
          errorMessage("Falló la conexión con el servidor.");
          console.log("ERROR BUY");
          return;
        }
        console.log("OK BUY");
        this.cartModal.hide();
        this.renderPolizas();
        this.reset();
      } catch (error) {
        console.error(error);
      }
    }

    cancel = () => {
        this.cartModal.hide();
        setTimeout(() => {
            this.modal = new bootstrap.Modal(this.dom.querySelector('#polizaModal'));
            this.modal.show();
        }, 500); 
    }
}
