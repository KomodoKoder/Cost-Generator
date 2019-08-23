// TODO: Add an option to select how many bays a spaced item will need to cover to determine how many +1 should be added to the end.
// TODO: Check submit button function
// TODO: Split web address into short and extended versions for display and functionality balance.
// TODO: spaced member radio functionality

class Material{
  constructor(/* 15 Args */material, supplier, price, area, width, length, spacing, bays, totalLength, sqmPrice, stPrice, lmPrice, sqmStPrice, amount, id){
    this.material = material;
    this.supplier = supplier;
    this.price = price;
    this.area = area;
    this.width = width;
    this.length = length;
    this.spacing = spacing;
    this.bays = bays;
    this.totalLength = totalLength;
    this.amount = amount;
    this.coverage;
    this.totalCost;
    this.sqmPrice = sqmPrice;
    this.sqmStPrice = sqmStPrice;
    this.stPrice = stPrice;
    this.lmPrice = lmPrice;
    this.id = id;

  }

  getCostSqmSt(){
    this.coverage = Number((this.width * this.length / 1000 / 1000).toFixed(3));
    this.amount = Math.ceil(this.area / this.coverage);
    this.totalCost = this.amount * this.price;
  }

  getCostSqm(){
    this.totalCost = this.area * this.price;
    this.amount = this.area + 'm2'
  }

  getCostSt(){
    this.totalCost = this.amount * this.price;
  }

  getCostSpaced(){
    this.amount = Math.ceil(this.totalLength / this.spacing + 1) * this.bays;
    this.totalCost = this.amount * this.price;
  }

  getCostLm(){
    this.amount = this.totalLength + ' m'
    this.totalCost = this.totalLength * this.price;
  }

} // End of Material Class


// Declarations
const table = document.getElementById('table-area');
const formsPanel = document.getElementById('forms-panel');
const tablePanel = document.getElementById('table-panel');
const sqmCostForm = document.getElementById('sqmCostForm');
const stCostForm = document.getElementById('stCostForm');
const lmCostForm = document.getElementById('lmCostForm');
const priceType = document.getElementById('price-type');
const total = document.getElementById('total');
const sidebarToggle = document.getElementById('sidebar-toggle');
const editForm = document.getElementById('edit-form');
const sqmBody = document.getElementById('sqm-form-body');
const stBody = document.getElementById('st-form-body');
const lmBody = document.getElementById('lm-form-body');


// New cost sqm price radio options
const priceSqm = document.getElementById('price-m2');
const priceSt = document.getElementById('price-st');

// New cost sqm price radio options forms
const sqmForm = document.getElementById('m2-form');
const sqmStForm = document.getElementById('st-form');

// New cost sqm input fields
const toggleSqm = document.getElementById('toggle-form-sqm');
const materialInputSqm = document.getElementById('material-sqm-form');
const supplierInputSqm = document.getElementById('supplier-sqm-form');
const priceInputSqm = document.getElementById('price-sqm-form');
const areaInputSqm = document.getElementById('area-sqm-form');
const areaInputSqmSt = document.getElementById('area-st-sqm-form');
const widthInputSqmSt = document.getElementById('width-sqm-form');
const lengthInputSqmSt = document.getElementById('length-sqm-form');

// New cost st input fields
const materialInputSt = document.getElementById('material-st-form');
const supplierInputSt = document.getElementById('supplier-st-form');
const priceInputSt = document.getElementById('price-st-form');
const amountInputSt = document.getElementById('amount-st-form');
const spacingInputSt = document.getElementById('spacing-st-form');
const totalLengthInputSt = document.getElementById('total-length-st-form');
const baysInputSt = document.getElementById('bays-st-form');

// New cost st radio options
const isSpaced = document.getElementById('is-spaced');
const notSpaced = document.getElementById('not-spaced');

// New cost st radio forms
const isSpacedForm = document.getElementById('st-form-spaced');
const notSpacedForm = document.getElementById('st-form-not-spaced');

// New cost Lm input fields
const materialInputLm = document.getElementById('material-lm-form');
const supplierInputLm = document.getElementById('supplier-lm-form');
const priceInputLm = document.getElementById('price-lm-form');
const totalLengthInputLm = document.getElementById('total-length-lm-form');

// Event Listeners
formsPanel.addEventListener('click', formEvent);
sqmCostForm.addEventListener('submit', createNewSqmMaterial);
stCostForm.addEventListener('submit', createNewStMaterial);
lmCostForm.addEventListener('submit', createNewLmMaterial);
table.addEventListener('click', tableEvent);
sidebarToggle.addEventListener('click', toggleSidebar);
table.addEventListener('click', editMaterial);


// Functions

function getTableData(){
  table.innerHTML = '';
  let materials;
  let total = 0;
  if(localStorage.getItem('materials') === null){
    materials = [];
  } else {
    materials = JSON.parse(localStorage.getItem('materials'));
    for(let i = 0; i < materials.length; i++){
      let table = document.querySelector('#table-area');
      let row = document.createElement('tr');
      let material = document.createElement('td');
      material.className = 'ml-3';
      material.appendChild(document.createTextNode(`${materials[i].material}`));
      row.appendChild(material);
      let supplier = document.createElement('td');
      let supLink = document.createElement('a');
      let linkText = materials[i].supplier.includes('http') ? materials[i].supplier : 'http://' + materials[i].supplier;
      supLink.className = "btn btn-link";
      supLink.setAttribute('href', linkText);
      supLink.setAttribute('target', "_blank");
      supLink.appendChild(document.createTextNode(`${materials[i].supplier}`));
      supplier.appendChild(supLink);
      row.appendChild(supplier);
      let amount = document.createElement('td');
      amount.appendChild(document.createTextNode(`${materials[i].amount}`));
      row.appendChild(amount);
      let price = document.createElement('td');
      price.innerHTML = `
        <span class="cost-list">${materials[i].price}</span> <span>${materials[i].sqmPrice? 'kr/m2':  materials[i].lmPrice? 'kr/lm' : 'kr/st'}</span>
      `;
      row.appendChild(price);
      let cost = document.createElement('td');
      cost.innerHTML = `
        <span class="costs">${materials[i].totalCost}</span> <span>kr</span>
      `;
      row.appendChild(cost);
      let edit = document.createElement('td');
      let editLink = document.createElement('i');
      editLink.className = 'fa fa-pencil text-dark edit';
      edit.className = 'text-center';
      edit.appendChild(editLink);
      row.appendChild(edit);
      let checked = document.createElement('td');
      let box = document.createElement('input');
      box.className = 'cost-selected';
      box.type = 'checkbox';
      checked.className = 'text-center';
      box.checked = true;
      checked.appendChild(box);
      row.appendChild(checked);
      let remove = document.createElement('td');
      let link = document.createElement('i');
      link.className = 'fa fa-times text-firetruck delete';
      remove.appendChild(link);
      remove.className = 'text-center';
      row.appendChild(remove);
      row.id = materials[i].id;
      table.appendChild(row);
    }
  }
  getTotal();
  setTimeout(function(){
    toggleSidebar();
  }, 500);
}
getTableData();

function getTotal(){
  let costs = document.querySelectorAll('.costs');
  let checked = document.querySelectorAll('.cost-selected');
  var totalCost = 0;
  for(let i = 0; i < costs.length; i++){
    if(checked[i].checked){
      let x = Number(costs[i].textContent);
      totalCost += x;
    }
  }
  total.innerHTML = `
    ${totalCost} <span class="text-muted">kr</span>
  `;
}

function tableEvent(e){
  // Remove item from the DOM
  if(e.target.classList.contains('delete')){
    let materials;

    // Remove item from localStorage
    if(localStorage.getItem('materials') === null){
      materials = []
    } else {
      materials = JSON.parse(localStorage.getItem('materials'));
      for(let i = 0; i < materials.length; i++){
        if(materials[i].id === Number(e.target.parentElement.parentElement.id)){
          materials.splice(i,1);
          localStorage.setItem('materials', JSON.stringify(materials));
        }
      }
    }
    e.target.parentElement.parentElement.remove();
    getTotal();
  } else if(e.target.classList.contains('cost-selected')){
    getTotal();
  }
}

function formEvent(e){

  let target = e.target;
  if(target.classList.contains('form-toggle')){
    let formBody = target.parentElement.parentElement.parentElement.nextElementSibling;
    let formHeader = target.parentElement.parentElement.parentElement;
    if(formBody.classList.contains('toggle-hide')){
      formBody.classList.remove('toggle-hide');
      target.parentElement.innerHTML = `
        <i class="fa mt-2 fa-minus-square text-light form-toggle"></i>
      `;
      formHeader.classList.remove('rounded');
      formHeader.className += ' rounded-top';
    } else {
      formBody.className += ' toggle-hide';
      formHeader.style.background = '#333';
      formHeader.classList.remove('text-dark');
      formHeader.classList.remove('rounded-top');
      formHeader.className += ' rounded text-light';
      target.parentElement.innerHTML = `
        <i class="fa fa-2x mt-2 fa-plus-square text-green-test form-toggle"></i>
      `;
    }
  } else if(target === priceSqm){
    if(sqmForm.classList.contains('toggle-hide')){
      sqmForm.classList.remove('toggle-hide');
      if(!sqmStForm.classList.contains('toggle-hide')){
        sqmStForm.className += ' toggle-hide';
      }
    }
  } else if(target === priceSt){
    if(sqmStForm.classList.contains('toggle-hide')){
      sqmStForm.classList.remove('toggle-hide');
      if(!sqmForm.classList.contains('toggle-hide')){
        sqmForm.className += ' toggle-hide';
      }
    }
  } else if(target === isSpaced){
    if(isSpacedForm.classList.contains('toggle-hide')){
      isSpacedForm.classList.remove('toggle-hide');
      if(!notSpacedForm.classList.contains('toggle-hide')){
        notSpacedForm.className += ' toggle-hide';
      }
    }
  } else if(target === notSpaced){
    if(notSpacedForm.classList.contains('toggle-hide')){
      notSpacedForm.classList.remove('toggle-hide');
      if(!isSpacedForm.classList.contains('toggle-hide')){
        isSpacedForm.className += ' toggle-hide';
      }
    }
  }
}

function createNewSqmMaterial(e){
  let button = e.target.firstElementChild.children[1].lastElementChild;
    button.innerHTML = `
      <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i>
    `;
    setTimeout(function(){
      button.innerHTML = `
        <i class="fa fa-calculator fa-2x fa-fw"></i>
      `;
      if(priceSqm.checked){
        let material = materialInputSqm.value;
        let supplier = supplierInputSqm.value;
        let price = priceInputSqm.value;
        let area = areaInputSqm.value;
        let sqmPrice = true;
        let id = Date.now().valueOf();
        let newMaterial = new Material(material, supplier, price, area, null, null, null, null, sqmPrice, false, false, false, null, id);
        newMaterial.getCostSqm();
        sqmForm.className += ' toggle-hide';
        priceSqm.checked = false;
        sqmBody.className += ' toggle-hide';
        toggleSqm.innerHTML = `
          <i class="fa fa-2x mt-2 fa-plus-square text-green-test form-toggle"></i>
        `;


        // Store new item in localStorage

        if(localStorage.getItem('materials') === null){
          materials = [];
        } else {
          materials = JSON.parse(localStorage.getItem('materials'));
        }
        materials.push(newMaterial);
        localStorage.setItem('materials', JSON.stringify(materials));
        getTableData();

      } else if(priceSt.checked){
        let material = materialInputSqm.value;
        let supplier = supplierInputSqm.value;
        let price = priceInputSqm.value;
        let area = areaInputSqmSt.value;
        let width = widthInputSqmSt.value;
        let length = lengthInputSqmSt.value;
        let id = Date.now().valueOf();
        let newMaterial = new Material(material, supplier, price, area, width, length, null, null, null, false, false, false, true, null, id);
        newMaterial.getCostSqmSt();
        priceSt.checked = false;
        sqmStForm.className += ' toggle-hide';
        sqmBody.className += ' toggle-hide';
        toggleSqm.innerHTML = `
          <i class="fa fa-2x fa-plus-square text-green-test form-toggle"></i>
        `;

        // Store new item in localStorage

        if(localStorage.getItem('materials') === null){
          materials = [];
        } else {
          materials = JSON.parse(localStorage.getItem('materials'));
        }
        materials.push(newMaterial);
        localStorage.setItem('materials', JSON.stringify(materials));
        getTableData();
      }

      // Reset form input values
      materialInputSqm.value = '';
      supplierInputSqm.value = '';
      priceInputSqm.value = '';
      areaInputSqm.value = '';
      areaInputSqmSt.value = '';
      widthInputSqmSt.value = '';
      lengthInputSqmSt.value = '';

      window.scrollTo();

    }, 1000);

    e.preventDefault();

}

function createNewStMaterial(e){

  let button = e.target.firstElementChild.children[1].lastElementChild
    button.innerHTML = `
      <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i>
    `;
    setTimeout(function(){
      button.innerHTML = `
        <i class="fa fa-calculator fa-2x fa-fw"></i>
      `;
      if(isSpaced.checked){
        let material = materialInputSt.value;
        let supplier = supplierInputSt.value;
        let price = priceInputSt.value;
        let spacing = spacingInputSt.value;
        let bays = baysInputSt.value;
        let totalLength = totalLengthInputSt.value;
        let id = Date.now().valueOf();
        let newMaterial = new Material(material, supplier, price, null, null, null, spacing, bays, totalLength, false, true, false, false, null, id);
        newMaterial.getCostSpaced();
        isSpaced.checked = false;

        // Store new item in localStorage

        if(localStorage.getItem('materials') === null){
          materials = [];
        } else {
          materials = JSON.parse(localStorage.getItem('materials'));
        }
        materials.push(newMaterial);
        console.log(newMaterial);
        localStorage.setItem('materials', JSON.stringify(materials));
        getTableData();
      } else if(notSpaced.checked){
        let material = materialInputSt.value;
        let supplier = supplierInputSt.value;
        let price = priceInputSt.value;
        let amount = amountInputSt.value;
        let id = Date.now().valueOf();
        let newMaterial = new Material(material, supplier, price, null, null, null, null, null, null, false, true, false, false, amount, id);
        newMaterial.getCostSt();
        notSpaced.checked = false;
        // Store new item in localStorage

        if(localStorage.getItem('materials') === null){
          materials = [];
        } else {
          materials = JSON.parse(localStorage.getItem('materials'));
        }
        materials.push(newMaterial);
        localStorage.setItem('materials', JSON.stringify(materials));
        getTableData();
      }

      // Reset form input values
      materialInputSt.value = '';
      supplierInputSt.value = '';
      priceInputSt.value = '';
      amountInputSt.value = '';
      spacingInputSt.value = '';
      baysInputSt.value = '';
      totalLengthInputSt.value = '';
    },1000);

  e.preventDefault();
}

function createNewLmMaterial(e){
  let material = materialInputLm.value;
  let supplier = supplierInputLm.value;
  let price = priceInputLm.value;
  let totalLength = totalLengthInputLm.value;
  let id = Date.now().valueOf();
  let newMaterial = new Material(material, supplier, price, null, null, null, null, null, totalLength, false, false, true, false, null, id);
  newMaterial.getCostLm();

  // Store new item in localStorage

  if(localStorage.getItem('materials') === null){
    materials = [];
  } else {
    materials = JSON.parse(localStorage.getItem('materials'));
  }
  materials.push(newMaterial);
  console.log(newMaterial);
  localStorage.setItem('materials', JSON.stringify(materials));
  getTableData();

  // Reset form input values
  materialInputLm.value = ''
  supplierInputLm.value = ''
  priceInputLm.value = ''
  totalLengthInputLm.value = ''

  e.preventDefault();
}

function toggleSidebar(){
  if(tablePanel.classList.contains('col-md-9')){
    formsPanel.style.left = '-24%';
    sidebarToggle.style.left = '-25px';
    tablePanel.classList.remove('col-md-9');
    tablePanel.className += ' col-md-12';
    formsPanel.style.background = 'rgba(255, 255, 255, 1)'
    formsPanel.style.border = 'none'
    sidebarToggle.style.background = 'rgba(76,189,180,0.7)'
    setTimeout(function(){
      sidebarToggle.innerHTML = '';
    }, 50);
    setTimeout(function(){
      sidebarToggle.innerHTML = `
        <i class="fa fa-arrow-right text-light" aria-hidden="true" id="show-arrow"></i>
      `;
    }, 700);
  } else {
    formsPanel.style.left = '0';
    sidebarToggle.style.left = 'calc(25% - 30px)';
    tablePanel.classList.remove('col-md-12');
    tablePanel.className += ' col-md-9';
    formsPanel.style.background = 'rgba(51, 51, 51, 1)';
    sidebarToggle.style.background = 'rgba(76,189,180,1)'
    setTimeout(function(){
      sidebarToggle.innerHTML = '';
    }, 50);
    setTimeout(function(){
      sidebarToggle.innerHTML = `
        <i class="fa fa-arrow-left text-light" aria-hidden="true" id="hide-arrow"></i>
      `;
    }, 700);
  }

}

function editMaterial(e){
  if(e.target.classList.contains('edit')){
    if(tablePanel.classList.contains('col-md-12')){
      toggleSidebar();
    }
    let material;
    let materialId = parseInt(e.target.parentElement.parentElement.id);
    let materials;
    if(localStorage.getItem('materials') === null){
      materials = [];
    } else {
      materials = JSON.parse(localStorage.getItem('materials'));
    }
    for(let i = 0; i < materials.length; i++){
      if(materials[i].id === materialId){
        material = materials[i];
      }
    }
    if(material.sqmPrice){
      // Close other forms
      if(!stBody.classList.contains('toggle-hide')){
        stBody.className += ' toggle-hide';
      }
      if(!lmBody.classList.contains('toggle-hide')){
        lmBody.className += ' toggle-hide';
      }
      // Show form
      sqmBody.classList.remove('toggle-hide');
      // Update toggle button
      toggleSqm.innerHTML = `
        <i class="fa fa-minus-square text-light form-toggle"></i>
      `;
      // Set input values
      materialInputSqm.value = material.material;
      supplierInputSqm.value = material.supplier;
      priceInputSqm.value = material.price;
      areaInputSqm.value = material.area;
      // Show radio form
      priceSqm.checked = true;
      if(sqmForm.classList.contains('toggle-hide')){
        sqmForm.classList.remove('toggle-hide');
      }

    } else if(material.sqmStPrice){
      if(tablePanel.classList.contains('col-md-12')){
        toggleSidebar();
      }
      // Close other forms
      if(!stBody.classList.contains('toggle-hide')){
        stBody.className += ' toggle-hide';
      }
      if(!lmBody.classList.contains('toggle-hide')){
        lmBody.className += ' toggle-hide';
      }
      // Show form
      sqmBody.classList.remove('toggle-hide');
      // Update toggle button
      toggleSqm.innerHTML = `
        <i class="fa fa-minus-square text-light form-toggle"></i>
      `;
      // Set input values
      materialInputSqm.value = material.material;
      supplierInputSqm.value = material.supplier;
      priceInputSqm.value = material.price;
      areaInputSqmSt.value = material.area;
      widthInputSqmSt.value = material.width;
      lengthInputSqmSt.value = material.length;
      // Show radio form
      priceSt.checked = true;
      if(sqmStForm.classList.contains('toggle-hide')){
        sqmStForm.classList.remove('toggle-hide');
      }
    }
  }
}
