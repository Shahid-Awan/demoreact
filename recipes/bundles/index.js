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
  Input,
} from "reactstrap"

import { history } from "../../../history";

import DataTable from "react-data-table-component"
import Select from "react-select";
import { Search } from "react-feather"

import AppConfig from "../../../configs/appConfig";
import SweetAlert from 'react-bootstrap-sweetalert';

import * as Icon from "react-feather";

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


class Bundle extends React.Component {

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
        name: "Bundle",
        selector: "bundle",
        sortable: true,
        minWidth: "200px",
        cell: row => (
          <div colspan='3' className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
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
        name: "Price",
        selector: " price ",
        sortable: true,
        cell: row => (
          <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-end py-xl-0 py-1 check">
            <span>{window.AppSession.currency} {row.price}</span>
          </div>
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
    data: [

    ],
    filteredData: [],
    value: ""
  }
  Edit(id, e) {
    history.push("/recipes/bundles/addbundle?id=" + id);
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
          (item.category || '').toLowerCase().startsWith(value.toLowerCase());
        let includesCondition =
          (item.name || '').toLowerCase().includes(value.toLowerCase()) ||
          (item.category || '').toLowerCase().includes(value.toLowerCase());


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
    fetch(AppConfig.apiBaseUrl + "DeleteBundle", requestOptions).then(res => res.text()).then(res => {
      this.setState({ "defaultAlert": false, confirmAlert: true });
      this.GetBundles();
    }).catch(err => console.error(err));
  }
  componentDidMount() {
    this.GetBundles();
  }
  GetBundles() {
    fetch(AppConfig.apiBaseUrl + "GetBundles?id=" + window.AppSession.companyId).then(res => res.text()).then(res => {
      var res = JSON.parse(res);

      if (res.length && res[0] && res[0].length) {
        this.setState({ data: res[0] });
      }
      else {
        this.setState({ data: [] });
      }
    }).catch(err => err);
  }

  render() {

    let { data, columns, value, filteredData } = this.state


    return (
      <React.Fragment>

        <Card>
          <CardHeader className="row ">
            <Col lg="6" sm="6" md="6">
              <CardTitle>Bundles</CardTitle>
            </Col>
            <Col className="text-right" lg="6" sm="6" md="6">
              <Button.Ripple color="primary" onClick={() => history.push("/recipes/bundles/addbundle")}>Add New</Button.Ripple>
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

export default Bundle