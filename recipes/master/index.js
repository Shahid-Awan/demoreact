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
  FormText,
  Form
  
  } from "reactstrap"
  import AppConfig from "../../../configs/appConfig";

import DataTable from "react-data-table-component"
import { history } from "../../../history";
import { Search } from "react-feather"
import logo from '../../../assets/img/add_ingredients.jpg';
import '../../../style.css'
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

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



class Recipes extends React.Component{

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
            selector: "name",
            sortable: true,
            minWidth: "200px",
            cell: row => (
                <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
                    <span>{row.name}</span>
                </div>
            )
        },
        {
            name: "Category",
            selector: "category",
            sortable: true,
            minWidth: "200px",
            cell: row => (
                <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
                    {row.category}
                </div>
            ) 
        },
        {
            name: " ",
            selector: " ",
            sortable: true,
            cell: row => (
              <div className="d-flex flex-xl-row flex-column align-items-xl-end align-items-end py-xl-0 py-1 float-right">

                <Button.Ripple className=" btn-sm" block color="primary" disabled={row.isassigned} outline onClick={e => this.AddNew(row)} >{row.isassigned?"Added":"Add"}</Button.Ripple>
              
              </div>
            )
        },
   
     
    ],
    data: [],
    filteredData: [],
    value: "",
    ingredientUnitDDL:[],
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
}

handleFilter = e => {
    let value = e.target.value
    let data = this.state.data
    let filteredData = this.state.filteredData
    this.setState({ value })

    if (value.length) {
        filteredData = data.filter(item => {
            let startsWithCondition =
                (item.name||'').toLowerCase().startsWith(value.toLowerCase()) ||
                (item.category||'').toLowerCase().startsWith(value.toLowerCase());
            let includesCondition =
                (item.name||'').toLowerCase().includes(value.toLowerCase()) ||
                (item.supplier||'').toLowerCase().includes(value.toLowerCase()) ;
                

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
    this.setState({ confirmAlert: true });
}
componentDidMount() {
  this.GeIngredientUnits();
  this.GetIngredientMasters();
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

GetIngredientMasters(){
  fetch(AppConfig.apiBaseUrl + "GetIngredientMasters?id="+window.AppSession.companyId).then(res => res.text()).then(res => {
    var res = JSON.parse(res);
  
    if (res.length && res[0] && res[0].length) {
      this.setState({ data: res[0] });
    }
    else{
      this.setState({ data: [] });
    }
  }).catch(err => err);
}
   
  
  AddNew(row){
    this.setState(prevState => ({
      addmodal: true,   
      id:0,
      name:row.name,
      purchaseSize:'',
      unit:'',
      cost:'',
      supplier:'',
      isSpecific:'',
      specificVol:'',
      specificWeight:'',
      specificUnit:'',
      categoryId:'', 
      master_id:row.id,
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
      companyId:window.AppSession.companyId,
      master_id:this.state.master_id,
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
      this.GetIngredientMasters();
    }).catch(err => console.error(err));
      return false;

   
  }
  toggleModal = () => {
    this.setState(prevState => ({
      addmodal: !prevState.addmodal
    }))
  }
  render() {
 
    let { data, columns, value, filteredData } = this.state


    return (
      <React.Fragment>

        
              <Card>
                <CardHeader className="row ">
                    <Col lg="6" sm="6" md="6">
                        <CardTitle>Master</CardTitle>
                    </Col>
                    <Col className="text-right" lg="6" sm="6" md="6">
                        <Button color="primary" onClick={() => history.push("/recipes/ingredients/index")}>View Ingredient</Button>
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
   


        <Modal isOpen={this.state.addmodal}
                  toggle={this.toggleModal}
                  className="modal-dialog-centered" >
                  <ModalHeader toggle={this.toggleModal} style={{
                    textAlign:"center",
                  }}>
                    <img src={logo} alt="Logo" style={{
                      alignItems:"center",
                      paddingLeft:"120px",
                      paddingBottom:"30px",
                    }} />
                    <br/>
                    <span style={{
                      textAlign:"center",
                      paddingLeft:"130px",
                    }}><b>{this.state.name}</b></span>
          </ModalHeader>
          <Form Form onSubmit={e => this.Save(e)}>
          <ModalBody>
          <FormGroup>
        <Label for="ingredients">Ingredient Name</Label>
        <Input type="text"  placeholder="Enter Ingredients Name"
        
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
         value={this.state.cost} onChange={e => this.setState({ cost: e.target.value })} 
        />
        </FormGroup>
        </Col>
    
      </Row>

      
      <FormGroup>
        <Label for="supplier">Supplier<FormText color="muted">
         Optional
        </FormText></Label>
        <Input type="text" placeholder="supplier"   
        value={this.state.supplier} onChange={e => this.setState({ supplier: e.target.value })} />
      </FormGroup>
      
      
          </ModalBody>
          <ModalFooter>
          <Row>
                  <Col md={6}>
                  <Button className="btn btn-secondary float-left" onClick={e => this.Cancel()}>
                      Cancel
                    </Button>
                    </Col>
                    <Col md={6}>
                    <Button className="btn btn-success float-right" type="submit">
                      Save
                    </Button>
                    </Col>
                    </Row>

          </ModalFooter>  
          </Form>
        </Modal>
        
      </React.Fragment>
    )
  }
}

export default Recipes