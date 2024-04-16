import React from "react"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  FormText,
  Row,
  Col
} from "reactstrap"
import DataTable from "react-data-table-component"
import { Star, Search } from "react-feather"
import * as Icon from "react-feather"
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from "react-toastify"

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
class Vendor extends React.Component{

  handleAlert = (state, value) => {
    if(state=='confirmAlert' && value==true){
        this.ProccedDelete();
    }
    else{
      this.setState({ [state] : value });
    }
  }

  state = {
    defaultAlert : false, 
    confirmAlert : false, 
    cancelAlert : false,
    activeId:null,
    addmodal: false,
    Ingredients:null,
    size:null,
    measurement:null,
    supplier:null, 
    columns: [
      {
        name: "Ingredients Name",
        selector: "Ingredients",
        sortable: true,
        minWidth: "200px",
        cell: row => (          
          <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
            <span>{row.Ingredients}</span>
          </div>
        )
      },
      {
        name: "Purchase Size",
        selector: "size",
        sortable: true,
        minWidth: "200px",
        cell: row => (
          <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
            {row.size}
          </div>
        )
      },
      {
        name: "measurement",
        selector: "measurement",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">{row.measurement}</p>
        )
      },
      {
        name: "Contact No",
        selector: "supplier",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">{row.supplier}</p>
        )
      },
      {
        name: "Feedback",
        selector: "",
        sortable: true,
        cell: row => {
          return (
            <div className="d-flex">
             <a className="" onClick={e => this.Edit(row.id,e)}><Icon.Edit size={22} /></a> 
             <a className="" onClick={e => this.Delete(row.id,e)}><Icon.Delete size={22} /></a>
            </div>
          )
        }
      }
    ],
    data: [],
    filteredData: [],
    value: ""
  }
  Edit(id,e){    
    this.setState({activeId : id });
    this.GetVendor(id);
    console.log('edit',id);
  }
  Delete(id){
    this.handleAlert("defaultAlert", true);
    this.setState({activeId : id });
    
  }
  ProccedDelete(){

    this.DeleteVendor(this.state.activeId);
  }
  handleFilter = e => {
    let value = e.target.value
    let data = this.state.data
    let filteredData = this.state.filteredData
    this.setState({ value })

    if (value.length) {
      filteredData = data.filter(item => {
        let startsWithCondition =
          item.Ingredients.toLowerCase().startsWith(value.toLowerCase()) ||
          item.size.toLowerCase().startsWith(value.toLowerCase()) ||
          item.measurement.toLowerCase().startsWith(value.toLowerCase()) ||
          item.supplier.toLowerCase().startsWith(value.toLowerCase());
        let includesCondition =
          item.Ingredients.toLowerCase().includes(value.toLowerCase()) ||
          item.size.toLowerCase().includes(value.toLowerCase()) ||
          item.measurement.toLowerCase().includes(value.toLowerCase()) ||
          item.supplier.toLowerCase().includes(value.toLowerCase());

        if (startsWithCondition) {
          return startsWithCondition
        } else if (!startsWithCondition && includesCondition) {
          return includesCondition
        } else return null
      })
      this.setState({ filteredData })
    }
  }
constructor(props){
  super(props);

}

DeleteVendor(id){
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id})
};
fetch("http://localhost:9000/testAPI/DeleteVendor",requestOptions).then(res=>res.text()).then(res=>{
    console.log('DeleteVendor',res);
    this.setState({ confirmAlert : true });
    this.GetVendors();
  }).catch(err=>err);
}

GetVendor(id){
  fetch("http://localhost:9000/testAPI/GetVendor?id="+id).then(res=>res.text()).then(res=>{
    console.log('Get Vendor',res);
    res=JSON.parse(res)[0];
    this.setState(prevState => ({
      addmodal: true,
      Ingredients:res.Ingredients,
      size:res.size,
      measurement:res.measurement,
      supplier:res.supplier
    }));    
  }).catch(err=>err);
}
GetVendors(){
    fetch("http://localhost:9000/testAPI/GetVendors").then(res=>res.text()).then(res=>{
      this.setState({data:JSON.parse(res)});
    }).catch(err=>err);
}
AddNew(){
  this.setState(prevState => ({
    addmodal: true,
    activeId:null,
    Ingredients:null,
    size:null,
    measurement:null,
    supplier:null
  }));
}
Save(){
var data={
 id:this.state.activeId,
 Ingredients:this.state.Ingredients,
 size:this.state.size,
 measurement:this.state.measurement,
 supplier:this.state.supplier, 
};



const requestOptions = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
};
fetch("http://localhost:9000/testAPI/AddUpdateVendor",requestOptions).then(res=>res.text()).then(res=>{
  this.GetVendors();
  toast.success("Saved successfully!");
 


  this.setState(prevState => ({
    addmodal: false,
    activeId:null,
    Ingredients:null,
    size:null,
    measurement:null,
    supplier:null
  }));
 
}).catch(err=>err);



}
toggleModal = () => {
  this.setState(prevState => ({
    addmodal: !prevState.addmodal
  }))
}



  componentDidMount(){
    this.GetVendors();
  }
  render() {
    let { data, columns, value, filteredData } = this.state
    return (
      <Card>
        <CardHeader>
          <CardTitle>New Ingredients</CardTitle>
        </CardHeader>
        <CardBody className="rdt_Wrapper">

        <div className="add-new">
        <Button.Ripple color="primary"  onClick={e => this.AddNew()}>Add New</Button.Ripple>
      </div>
          <DataTable
            className="dataTable-custom"
            data={value.length ? filteredData : data}
            columns={columns}
            noHeader
            pagination
            subHeader
            subHeaderComponent={
              <CustomHeader value={value} handleFilter={this.handleFilter} />
            }
          />





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
          onConfirm={() =>{
            this.handleAlert("defaultAlert", false)
            this.handleAlert("cancelAlert", false)
          }}
        >
            <p className="sweet-alert-text">
              Your imaginary file is safe :)
            </p>
        </SweetAlert>


             <Modal
                  isOpen={this.state.addmodal}
                  toggle={this.toggleModal}
                  className="modal-dialog-centered"
                >
                  <ModalHeader toggle={this.toggleModal}>
                    Vendor
                  </ModalHeader>
                  <ModalBody>
               <Row>
               <Col lg="12" md="12" sm="12">
                <FormGroup>
                <Label for="basicInput">Ingredient</Label>
                <Input type="text" id="basicInput" placeholder="Enter Ingredients Name" value={this.state.Ingredients} onChange={e => this.setState({ Ingredients: e.target.value })} />
              </FormGroup>
              </Col>

              <Col lg="6" md="6" sm="12">
                <FormGroup>
                <Label for="basicInput">Purchase Size</Label>
                <Input type="text" id="basicInput" placeholder="Enter Purchase Size" value={this.state.size} onChange={e => this.setState({ size: e.target.value })} />
              </FormGroup>
              </Col>
              <Col lg="6" md="6" sm="12">
                <FormGroup>
                <Label for="basicInput">Measurement</Label>
                <Input type="text" id="basicInput" placeholder="0" value={this.state.measurement} onChange={e => this.setState({ measurement: e.target.value })} />
              </FormGroup>
              </Col>
              <Col lg="6" md="12" sm="6">
                <FormGroup>
                <Label for="basicInput">Supplier<span className="TextMuted">(Optiona)</span></Label>
                <Input type="text" id="basicInput" placeholder="Enter Supplier Name" value={this.state.supplier} onChange={e => this.setState({ supplier: e.target.value })} />
              </FormGroup>
              </Col>
              <Col lg="6" md="6" sm="12">
              <FormGroup>
                <Label ><br/><br/><p> <b>value={this.state.supplier} onChange={e => this.setState({ supplier: e.target.value })} </b></p></Label>
              </FormGroup>
              </Col>
              <Col lg="12" md="12" sm="6">
                <FormGroup>
                <Label for="basicInput">Supplier<span className="TextMuted">(Optiona)</span></Label>
                <Input type="text" id="basicInput" placeholder="Enter Supplier Name" value={this.state.supplier} onChange={e => this.setState({ supplier: e.target.value })} />
              </FormGroup>
              </Col>
              <Col lg="12" md="12" sm="6">
              <Label for="basicInput">Add specific Volume / Weight value</Label>
              </Col>

               </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary"  onClick={e => this.Save()}>
                      Save
                    </Button>
                  </ModalFooter>
                </Modal>
        </CardBody>
      </Card>
    )
  }
}

export default Vendor