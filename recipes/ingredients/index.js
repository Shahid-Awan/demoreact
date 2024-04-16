import React from "react"
import {
  Table,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  TabContent,
  TabPane,
  Nav,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label, 
 Input, 
 CustomInput,
FormText,
Form
  } from "reactstrap"
  import Select from "react-select"
import { history } from "../../../history";
import { Search } from "react-feather"
import DataTable from "react-data-table-component"
import * as Icon from "react-feather";
import AppConfig from "../../../configs/appConfig";
import SweetAlert from 'react-bootstrap-sweetalert';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const measurements = [{"label":"kg","value":"kg"},{"label":"g","value":"g"},{"label":"mg","value":"mg"},{"label":"st","value":"st"},{"label":"lb","value":"lb"},{"label":"oz","value":"oz"},{"label":"gal (US)","value":"gal (US)"},{"label":"gal","value":"gal"},{"label":"qt (US)","value":"qt (US)"},{"label":"qt","value":"qt"},{"label":"pint (US)","value":"pint (US)"},{"label":"pint","value":"pint"},{"label":"cup (US)","value":"cup (US)"},{"label":"cup","value":"cup"},{"label":"fl oz (US)","value":"fl oz (US)"},{"label":"fl oz","value":"fl oz"},{"label":"Tbl (US)","value":"Tbl (US)"},{"label":"Tbl","value":"Tbl"},{"label":"tsp (US)","value":"tsp (US)"},{"label":"tsp","value":"tsp"},{"label":"l","value":"l"},{"label":"ml","value":"ml"},{"label":"ea","value":"ea"}];
const convFromMeasurements=[{"label":"cup (US)","value":"cup (US)"},{"label":"cup","value":"cup"},{"label":"Tbl (US)","value":"Tbl (US)"},{"label":"Tbl","value":"Tbl"},{"label":"tsp (US)","value":"tsp (US)"},{"label":"tsp","value":"tsp"}];
const CustomHeader = props => {
  return (
      <div className="d-flex flex-wrap justify-content-between">

          <div className="position-relative has-icon-left mb-1">
              <Input value={props.value} onChange={e => props.handleFilter(e)} />
              <div className="form-control-position">
                  <Search size="15" />
              </div>
          </div>
      </div>
  )
}



class Ingredients extends React.Component{

  handleAlert = (state, value) => {
    if (state == 'confirmAlert' && value == true) {
        this.ProccedDelete();
    }
    else {
        this.setState({ [state]: value });
    }
}

state = {
    activeTab: "1",
    addmodal: false,
    defaultAlert: false,
    confirmAlert: false,
    cancelAlert: false,
    activeId: null,
    columns: [
        {
            name: "Ingredients",
            selector: "ingredients",
            sortable: true,
            minWidth: "200px",
            cell: row => (
                <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
                    <span>{row.name}</span>
                </div>
            )
        },
        {
            name: "Supplier",
            selector: "supplier",
            sortable: true,
            minWidth: "200px",
            cell: row => (
                <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
                    {row.supplier}
                </div>
            )
        },
        {
            name: "Purchase Size",
            selector: "purchase_size",
            sortable: true,
            cell: row => (
                <p className="text-bold-500 text-truncate mb-0">{window.AppSession.currency} {row.purchaseSize}</p>
            )
        },
        {
          name: "Cost ",
          selector: "cost",
          sortable: true,
          cell: row => (
              <p className="text-bold-500 text-truncate mb-0">{window.AppSession.currency} {row.cost}</p>
          )
      },
        {
            name: "Action ",
            sortable: true,
            cell: row => (
                <p className="text-bold-500 text-truncate mb-0 d-flex">
                 
                 <a className="" onClick={e => this.Edit(row)}><Icon.Edit size={22} /></a>
                 <a className="" onClick={e => this.Delete(row.id, e)}><Icon.Delete size={22} /></a> 
                </p>
            )
        },
     
    ],
    data: [],
    filteredData: [],
    value: "",
    ingredientUnitDDL:[],
    name:'',
    purchaseSize:'',
    unit:'',
    cost:'',
    supplier:'',
    isSpecific:'',
    specificVol:'',
    specificWeight:'',
    specificUnit:'',
    categoryId:'',
};


Delete(id) {
    this.handleAlert("defaultAlert", true);
    this.setState({ activeId: id });
}
ProccedDelete() {

    this.DeleteFromApi(this.state.activeId);
}
handleFilter = e => {
    let value = e.target.value
    let data = this.state.data
    let filteredData = this.state.filteredData
    this.setState({ value })

    if (value.length) {
        filteredData = data.filter(item => {
            let startsWithCondition =
                item.name.toLowerCase().startsWith(value.toLowerCase()) ||
                item.supplier.toLowerCase().startsWith(value.toLowerCase()) ||
                (item.purchaseSize||'').toLowerCase().startsWith(value.toLowerCase());
            let includesCondition =
                item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.supplier.toLowerCase().includes(value.toLowerCase()) ||
                (item.purchaseSize||'').toLowerCase().includes(value.toLowerCase());
            if (startsWithCondition) {
                return startsWithCondition
            } else if (!startsWithCondition && includesCondition) {
                return includesCondition
            } else return null
        })
        this.setState({ filteredData })
    }
}

constructor(props) {
    super(props);
}

DeleteFromApi(id) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id })
  };
  fetch(AppConfig.apiBaseUrl + "DeleteIngredient", requestOptions)
  .then(res => res.text())
  .then(res => {
    this.setState({ "defaultAlert":false,confirmAlert: true });
    this.GetIngredients();
  }).catch(err => console.error(err));
}


componentDidMount() {
this.GetIngredients();
this.GeIngredientUnits();
}

GeIngredientUnits(){
  fetch(AppConfig.apiBaseUrl + "GetLookups?type="+AppConfig.LookupEnum.IngredientUnit+"&company_id="+window.AppSession.companyId).then(res => res.text()).then(res => {
    var res = JSON.parse(res);
    if (res.length && res[0] && res[0].length) {
      this.setState({ ingredientUnitDDL: res[0] });
    }
    else{
      this.setState({ ingredientUnitDDL: [] });
    }
  }).catch(err => err);
}

GetIngredients(){
  fetch(AppConfig.apiBaseUrl + "GetIngredients?id="+window.AppSession.companyId+"&company_id="+window.AppSession.companyId).then(res => res.text()).then(res => {
    var res = JSON.parse(res);
  
    if (res.length && res[0] && res[0].length) {
      this.setState({ data: res[0] });
    }
    else{
      this.setState({ data: [] });
    }
  }).catch(err => err);
}
   

  AddNew(){
    this.setState(prevState => ({
      addmodal: true,  
      id:0,
      name:'',
      purchaseSize:'',
      unit:'',
      cost:'',
      supplier:'',
      isSpecific:'',
      specificVol:'',
      specificWeight:'',
      specificUnit:'',
      categoryId:'',
    }));
  }

  Edit(row, e) {
    this.setState(prevState => ({
      addmodal: true,  
      id:row.id,
      name:row.name,
      purchaseSize:row.purchaseSize,
      unit:row.unit,
      cost:row.cost,
      supplier:row.supplier,
      isSpecific:row.isSpecific,
      specificVol:row.specificVol,
      specificWeight:row.specificWeight,
      specificUnit:row.specificUnit,
      categoryId:row.categoryId,
    }));

  }
  Cancel(){
    this.setState(prevState => ({
      addmodal: false,    
    }));
  }
  Save(e){
    e.preventDefault();
    var data={   
      id:this.state.id ,
      name:this.state.name,
      purchaseSize:this.state.purchaseSize,
      unit:this.state.unit,
      cost:this.state.cost,
      supplier:this.state.supplier,
      isSpecific:this.state.isSpecific,
      specificVol:this.state.specificVol,
      specificWeight:this.state.specificWeight,
      specificUnit:this.state.specificUnit,
      categoryId:this.state.categoryId,
      companyId:window.AppSession.companyId
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    fetch(AppConfig.apiBaseUrl + "AddUpdateIngredient", requestOptions).then(res => res.text()).then(res => {
      
      this.setState(prevState => ({
        addmodal: false,    
      }));
      this.GetIngredients();
    }).catch(err => console.error(err));
      return false;

   
  }
  toggleModal = () => {
    this.setState(prevState => ({
      addmodal: !prevState.addmodal
    }))
  }
  
  
  render() 
  {

    let { data, columns, value, filteredData } = this.state
 
    return (
       <React.Fragment>
              <Card>
                <CardHeader className="row ">
                    <Col lg="8" sm="8" md="8">
                        <CardTitle>Ingredients</CardTitle>
                    </Col>

                    <Col className="text-right" lg="2" sm="2" md="2">
                        <Button.Ripple color="primary" onClick={() => history.push("/recipes/master/index")}><Icon.PlusCircle size={15}/> Master</Button.Ripple>
                    </Col>
                    <Col className="text-left" lg="2" sm="2" md="2">
                        <Button.Ripple color="primary" onClick={e => this.AddNew()}>Add New</Button.Ripple>
                    </Col>
                </CardHeader>
                <CardBody className="rdt_Wrapper">
                <DataTableExtensions
                 data={value.length ? filteredData : data}
                 columns={columns}
                >
                    <DataTable
                        className="dataTable-custom"
                        noHeader
                        pagination
                    />
                    </DataTableExtensions>
                </CardBody>
            </Card>
        
        <Modal
                  isOpen={this.state.addmodal}
                  toggle={this.toggleModal}
                  className="modal-dialog-centered"
                >
                  <ModalHeader toggle={this.toggleModal}>
                    Ingredients
                  </ModalHeader>

                  <Form Form onSubmit={e => this.Save(e)}>
                  <ModalBody>
               <Row>
         <Col md="12">
         <FormGroup>
        <Label for="ingredients">Ingredient Name</Label>
        <Input  placeholder="Enter Ingredients Name" required
         value={this.state.name} onChange={e => this.setState({ name: e.target.value })}
        />
        </FormGroup>
        
      
      <Row form>
       <Col md={6}>   
        <FormGroup>
        <Label for="purchasesize">Purchase Size</Label>
        <Input type="number" placeholder="0"
         value={this.state.purchaseSize} onChange={e => this.setState({ purchaseSize: e.target.value })}
        />
        </FormGroup>
        </Col>
        <Col md={6}>
      <FormGroup>
        <Label for="measure">Measurement</Label>
        

        <select required className="form-control"  value={this.state.unit}  onChange={e => this.setState({ unit: e.target.value })}>
              <option value="" >Select</option>
                   {this.state.ingredientUnitDDL.map((option) => (
                          <option value={option.id} >{option.name}</option>
                   ))}
               </select>
    
      </FormGroup>
      </Col>
      </Row>

      <Row>
          <Col md={6}>
      <FormGroup>
        <Label for="cost">Cost Price</Label>
        <Input type="number" placeholder="0" 
            value={this.state.cost} onChange={e => this.setState({ cost: e.target.value })} />
        </FormGroup>
        </Col>
        <Col md={6}>
        <FormGroup>
      
          
      </FormGroup>
      </Col>
      </Row>

      
      <FormGroup>
        <Label for="supplier">Supplier<FormText color="muted">
         Optional
        </FormText></Label>
        <Input type="text" placeholder="supplier"
            value={this.state.supplier} onChange={e => this.setState({ supplier: e.target.value })}
        />
      </FormGroup>
      
      <FormGroup inline check>
      <Label check>
      <CustomInput type="checkbox"  checked={this.state.isSpecific} 
                   onChange={e =>this.setState({isSpecific: e.target.checked})}
                   id="ispecifc" label="Add specific Volume / Weight value" />
          
        </Label>
      </FormGroup>


      <FormGroup row>
         <Col sm={5}>
         <FormText>One</FormText>
   
         <select  className="form-control"  value={this.state.specificVol}  onChange={e => this.setState({ specificVol: e.target.value })}>
              <option value="" >Select</option>
                   {this.state.ingredientUnitDDL.map((option) => (
                          <option value={option.id} >{option.name}</option>
                   ))}
               </select>

        </Col>

        <Col sm={3}>
           <FormText>Has</FormText>
        <Input type="number"  placeholder="0" 
           value={this.state.specificWeight} onChange={e => this.setState({ specificWeight: e.target.value })}
        />
        </Col>
        <Col sm={3}>
          <br/>

          <select className="form-control"  value={this.state.specificUnit} onChange={e => this.setState({ specificUnit: e.target.value })}>              
              <option value="g">g</option>
              <option value="Oz">Oz</option>
               </select>
        </Col>
        
      </FormGroup>
           
           </Col>       
       
               </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Row>
                  <Col md={6}>
                  <Button className="btn btn-secondary float-left" onClick={e => this.Cancel()}>
                      Cancel
                    </Button>
                    </Col>
                    <Col md={6}>
                    <Button className="btn btn-success float-right">
                      Save
                    </Button>
                    </Col>
                    </Row>
                  </ModalFooter>
             </Form>
                </Modal>


                <SweetAlert title="Are you sure?"
            warning
            show={this.state.defaultAlert}
            showCancel
            reverseButtons
            cancelBtnBsStyle="danger"
            confirmBtnText="Yes, delete it!"
            cancelBtnText="Cancel"
            onConfirm={() => {
              this.handleAlert("basicAlert", false)
              this.handleAlert("confirmAlert", true)
            }}
            onCancel={() => {
              this.handleAlert("basicAlert", false)
              this.handleAlert("cancelAlert", true)
            }}
          >
            You won't be able to revert this!
        </SweetAlert>

          <SweetAlert success title="Deleted!"
            confirmBtnBsStyle="success"
            show={this.state.confirmAlert}
            onConfirm={() => {
              this.handleAlert("defaultAlert", false)
              this.handleAlert("confirmAlert", false)
            }}
          >
            <p className="sweet-alert-text">Your file has been deleted.</p>
          </SweetAlert>

          <SweetAlert error title="Cancelled"
            confirmBtnBsStyle="success"
            show={this.state.cancelAlert}
            onConfirm={() => {
              this.handleAlert("defaultAlert", false)
              this.handleAlert("cancelAlert", false)
            }}
          >
            <p className="sweet-alert-text">
              Your imaginary file is safe :)
            </p>
          </SweetAlert>
        
      </React.Fragment>
    )
  }
}

export default Ingredients 