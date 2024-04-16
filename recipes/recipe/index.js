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

  } from "reactstrap";

import DataTable from "react-data-table-component"
import { history } from "../../../history";
import { tableBasic } from "../TableSourceCode";
import { Search } from "react-feather"
import * as Icon from "react-feather";
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
    defaultAlert: false,
    confirmAlert: false,
    cancelAlert: false,
    activeId: null,
    columns: [
        {
            name: "Recipe",
            selector: "recipe",
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
            name: "Serving",
            selector: "serving",
            sortable: true,
            cell: row => (
                <p className="text-bold-500 text-truncate mb-0">{row.serving}</p>
            )
        },
        {
            name: "Custome Price",
            selector: "custome_price",
            sortable: true,
            cell: row => (
                <p className="text-bold-500 text-truncate mb-0">{window.AppSession.currency} {row.custom_price}</p>
            )
        },
        {
            name: "Cost Price",
            selector: "cost_price",
            sortable: true,
            cell: row => (
                <p className="text-bold-500 text-truncate mb-0 d-flex">{window.AppSession.currency} {row.cost_price} 
                </p>
                
            )
        },
        {
            name: "Action",
            selector: "action",
            sortable: true,
            cell: row => (
                <p className="text-bold-500 text-truncate mb-0 d-flex">
                 
                 <a onClick={e => history.push("/recipes/recipe/recipeadd?id="+row.id)}><Icon.Edit size={22} /></a>
                 <a  onClick={e => this.Delete(row.id, e)}><Icon.Delete size={22} /></a>
                </p>
                
            )
        },
     
    ],
    data: [ ],
    filteredData: [],
    value: ""
}
Edit(id, e) {
    history.push("/contacts/addContact")
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
                (item.name||'').toLowerCase().startsWith(value.toLowerCase()) ||
                (item.category||'').toLowerCase().startsWith(value.toLowerCase()) ||
                (item.serving||'').toLowerCase().startsWith(value.toLowerCase()) ||
                (item.custome_price||'').toLowerCase().startsWith(value.toLowerCase()) ||
                (item.cost_price||'').toLowerCase().startsWith(value.toLowerCase());
            let includesCondition =
                (item.name||'').toLowerCase().includes(value.toLowerCase()) ||
                (item.category||'').toLowerCase().includes(value.toLowerCase()) ||
                (item.serving||'').toLowerCase().includes(value.toLowerCase()) ||
                (item.custome_price||'').toLowerCase().includes(value.toLowerCase()) ||
                (item.cost_price||'').toLowerCase().includes(value.toLowerCase());

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


AddNew() {
    history.push("/recipes/recipe/recipeadd")
}

componentDidMount() {
    this.GetRecipes();
}

DeleteFromApi(id) {
     
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      };
      fetch(AppConfig.apiBaseUrl + "DeleteRecipe", requestOptions).then(res => res.text()).then(res => {
        this.setState({ "defaultAlert":false,confirmAlert: true });
        this.GetRecipes();
      }).catch(err => console.error(err));


    }
GetRecipes(){
    fetch(AppConfig.apiBaseUrl + "GetRecipes?id="+window.AppSession.companyId).then(res => res.text()).then(res => {
        var res = JSON.parse(res);
        if (res.length && res[0] && res[0].length) {
          this.setState({ data: res[0] });
        }
        else{
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
                        <CardTitle>Recipe</CardTitle>
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

export default Recipes