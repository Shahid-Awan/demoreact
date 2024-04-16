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
  Form

} from "reactstrap";
import * as Icon from "react-feather";
import DataTable from "react-data-table-component"
import Select from "react-select";
import { history } from "../../../history";
import { Search } from "react-feather"
import { tableBasic } from "../TableSourceCode";


import AppConfig from "../../../configs/appConfig";
import SweetAlert from 'react-bootstrap-sweetalert';
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



const colourOptions = [
  { value: "board", label: "Board" },
  { value: "card", label: "Card" },
  { value: "boxes", label: "Boxes" },
  { value: "furniture", label: "Furniture" },
  { value: "packing", label: "Packing" }
]

class Suppliers extends React.Component {

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
    defaultAlert: false,
    confirmAlert: false,
    cancelAlert: false,
    activeId: null,
    ingredientUnitDDL:[],
    columns: [
      {
        name: "Supplies",
        selector: "supplies",
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
        selector: "Category",
        sortable: true,
        minWidth: "200px",
        cell: row => (
          <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
            {row.category}
          </div>
        )
      },
      {
        name: "Supplier",
        selector: "supplier",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">{row.supplier}</p>
        )
      },
      {
        name: "Unit",
        selector: "unit",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">{row.unit}</p>
        )
      },
      {
        name: "Qty",
        selector: "qty",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">{row.qty}</p>
        )
      },
      {
        name: "Item Price",
        selector: "costPrice",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">{window.AppSession.currency} {row.costPrice}</p>
        )
      },
      {
        name: "Action ",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0 d-flex">

            <a className="" onClick={e => this.Edit(row.id)}><Icon.Edit size={22} /></a>
            <a className="" onClick={e => this.Delete(row.id, e)}><Icon.Delete size={22} /></a>
          </p>
        )
      },

    ],
    data: [],
    filteredData: [],
    value: "",
    categoryDDL: [],

    id: 0,
    lookupId: '',
    name: '',
    supplier: '',
    packSize: '',
    costPrice: '',
  }
  Edit(id, e) {
    fetch(AppConfig.apiBaseUrl + "GetSupply?id=" + id).then(res => res.text()).then(res => {
      var res = JSON.parse(res);
      var d = res[0][0];
      this.setState(prevState => ({
        addmodal: true,
        id: d.id,
        lookupId: d.lookupId,
        name: d.name,
        supplier: d.supplier,
        qty: d.qty,
        unit: d.unit,
        costPrice: d.costPrice,
      }));
    }).catch(err => err);
  }
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
          (item.name || '').toLowerCase().startsWith(value.toLowerCase()) ||
          (item.category || '').toLowerCase().startsWith(value.toLowerCase()) ||
          (item.supplier || '').toLowerCase().startsWith(value.toLowerCase());
        let includesCondition =
          (item.name || '').toLowerCase().includes(value.toLowerCase()) ||
          (item.category || '').toLowerCase().includes(value.toLowerCase()) ||
          (item.supplier || '').toLowerCase().includes(value.toLowerCase());


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
    fetch(AppConfig.apiBaseUrl + "DeleteSupply", requestOptions).then(res => res.text()).then(res => {
      this.setState({ "defaultAlert": false, confirmAlert: true });
      this.GetSupplies();
    }).catch(err => console.error(err));
  }
  componentDidMount() {
    this.GetSupplies();
    this.GetSuppliesCategory();
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
  GetSupplies() {
    fetch(AppConfig.apiBaseUrl + "GetSupplies?id=" + window.AppSession.companyId).then(res => res.text()).then(res => {
      var res = JSON.parse(res);

      if (res.length && res[0] && res[0].length) {
        this.setState({ data: res[0] });
      }
      else {
        this.setState({ data: [] });
      }
    }).catch(err => err);
  }

  GetSuppliesCategory() {
    fetch(AppConfig.apiBaseUrl + "GetLookups?type=" + AppConfig.LookupEnum.Supplies + "&company_id=" + window.AppSession.companyId).then(res => res.text()).then(res => {
      var res = JSON.parse(res);
      if (res.length && res[0] && res[0].length) {
        this.setState({ categoryDDL: res[0] });
      }
      else {
        this.setState({ categoryDDL: [] });
      }
    }).catch(err => err);
  }


  AddNew() {
    this.setState(prevState => ({
      addmodal: true,
      id: 0,
      lookupId: '',
      name: '',
      supplier: '',
      qty: '',
      costPrice: '',
      unit: '',
    }));
  }
  Cancel() {
    this.setState(prevState => ({
      addmodal: false,
    }));
  }
  Save(e) {
    e.preventDefault();
    var data = {
      id: this.state.id,
      lookupId: this.state.lookupId,
      name: this.state.name,
      supplier: this.state.supplier,
      qty: this.state.qty,
      costPrice: this.state.costPrice,
      unit: this.state.unit,
      companyId: window.AppSession.companyId
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    fetch(AppConfig.apiBaseUrl + "AddUpdateSupplies", requestOptions).then(res => res.text()).then(res => {

      this.setState(prevState => ({
        addmodal: false,
      }));
      this.GetSupplies();
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
              <CardTitle>Supplies</CardTitle>
            </Col>
            <Col className="text-right" lg="6" sm="6" md="6">
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

        <Modal isOpen={this.state.addmodal}
          toggle={this.toggleModal}
          className="modal-dialog-centered" >
          <ModalHeader toggle={this.toggleModal} style={{
            textAlign: "center",
          }}>
            Supplies
                  </ModalHeader>
          <Form Form onSubmit={e => this.Save(e)}>
            <ModalBody>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="ingredients">Category</Label>
                    <select required className="form-control" value={this.state.lookupId} onChange={e => this.setState({ lookupId: e.target.value })}>
                      <option value="" >Select</option>
                      {this.state.categoryDDL.map((option) => (
                        <option value={option.id} >{option.name}</option>
                      ))}
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <Label for="suppliername">Supplies</Label>
                    <Input type="text" placeholder="Enter Supplies"
                      value={this.state.name} onChange={e => this.setState({ name: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="supplier">Supplier</Label>
                    <Input type="text" placeholder="Enter Supplier"
                      value={this.state.supplier} onChange={e => this.setState({ supplier: e.target.value })}
                    />
                  </FormGroup>
                  <Row form>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="packsize">Qty</Label>
                        <Input type="number" placeholder="0"
                          value={this.state.qty} onChange={e => this.setState({ qty: e.target.value })}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="packsize">Unit</Label>

                        <select  className="form-control"  value={this.state.unit}  onChange={e => this.setState({ unit: e.target.value })}>
              <option value="" >Select</option>
                   {this.state.ingredientUnitDDL.map((option) => (
                          <option value={option.name} >{option.name}</option>
                   ))}
               </select>
                      
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="price">Unit Cost Price</Label>
                        <Input type="number" placeholder="0"
                          value={this.state.costPrice} onChange={e => this.setState({ costPrice: e.target.value })}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="price">Total </Label>
                        <Input type="number" placeholder="0" readOnly value={ (this.state.costPrice||0)*(this.state.qty||0)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>

            </ModalBody>

            <ModalFooter>
              <Button className="btn btn-secondary float-left" onClick={e => this.Cancel()}>Cancel</Button>
              <Button className="btn btn-success float-right">Save</Button>
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

export default Suppliers