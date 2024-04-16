import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Col,
  Input,
  Form,
  Button,
  Row,
} from "reactstrap";

import Select from "react-select";
import * as Icon from "react-feather";
import { Search } from "react-feather"
import { history } from "../../../history";
import DataTable from "react-data-table-component";

import queryString from 'query-string';
import AppConfig from "../../../configs/appConfig";
import _ from 'underscore';




import { ToastContainer } from "react-toastify"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"



class Bundles extends React.Component {

  
  constructor(props) {
    super(props);

  }

  state = {
    activeTab: "1",
    addmodal: false,
    defaultAlert: false,
    confirmAlert: false,
    cancelAlert: false,
    activeId: null,

    recipeCategoriesDDL: [],
    recipeMainList: [],
    suppliesMainList: [],
    id: '',
    name: '',
    category_id: '',
    price: '',
    details: [],

  }

  RecipeChanged(e) {
    debugger;
    if (_.filter(this.state.details, function (o) { return o.recipe_id == e.id }).length) {
      toast.error("This Recipe Already Added");
    }
    else {
      var _details = this.state.details;
      _details.push({ recipe_id: e.id, name: e.name, qty: 0, per_item_cost: e.cost_price });
      this.setState({ details: _details });
      this.UpdatePrice(_details);
    }
  }
  UpdateRecipeQty(e, item, i) {

    var _details = this.state.details;
    var d = _.filter(_details, function (o) { return o.recipe_id == item.recipe_id })[0];
    d.qty = e.target.value;
    this.setState({ details: _details });
    this.UpdatePrice(_details);
  }
  DeleteRecipe(e, item, i) {

    var _details = this.state.details;
    _details = _.filter(_details, function (o) { return o.recipe_id != item.recipe_id });
    this.setState({ details: _details });
    this.UpdatePrice(_details);
  }
  SuppliesChanged(e) {
    debugger;
    if (_.filter(this.state.details, function (o) { return o.supplies_id == e.id }).length) {
      toast.error("This Supplies Already Added");
    }
    else {
      var _details = this.state.details;
      _details.push({ supplies_id: e.id, name: e.name, qty: 0, per_item_cost: e.costPrice });
      this.setState({ details: _details });
      this.UpdatePrice(_details);
    }
  }
  UpdateSupplyQty(e, item, i) {
    var _details = this.state.details;
    var d = _.filter(_details, function (o) { return o.supplies_id == item.supplies_id })[0];
    d.qty = e.target.value;
    this.setState({ details: _details });
    this.UpdatePrice(_details);
  }
  DeleteSupply(e, item, i) {

    var _details = this.state.details;
    _details = _.filter(_details, function (o) { return o.supplies_id != item.supplies_id });
    this.setState({ details: _details });
    this.UpdatePrice(_details);
  }

  UpdatePrice(details) {
    var cost=0;
    for(var i=0;i<details.length;i++){
      var d=details[i];
      cost+= (d.qty||0)*(d.per_item_cost||0);
    }
    this.setState({ price: cost });
  }


  componentDidMount() {
    var p1 = new Promise((resolve, reject) => { this.GetRecipeCategory(resolve); });
    var p2 = new Promise((resolve, reject) => { this.GetRecipes(resolve); });
    var p3 = new Promise((resolve, reject) => { this.GetSupplies(resolve); });
    Promise.all([p1, p2, p3]).then(values => {
      let params = queryString.parse(this.props.location.search)
      if (params.id) {
        this.GetBundle(params.id);
      }
    });
  }
  GetBundle(id){
    fetch(AppConfig.apiBaseUrl + "GetBundle?id="+id).then(res => res.text()).then(res => {
      var res = JSON.parse(res);  
      if(res[0].length){
        var d=res[0][0];
        this.setState(prevState => ({
          id:d.id ,
          name: d.name,
          category_id: d.category_id,
          price: d.price,
          details: res[1],
        }));
      }
    }).catch(err => err);
  }
  GetRecipeCategory(resolve) {
    fetch(AppConfig.apiBaseUrl + "GetLookups?type=" + AppConfig.LookupEnum.Recipes+"&company_id="+window.AppSession.companyId).then(res => res.text()).then(res => {
      var res = JSON.parse(res);
      if (res.length && res[0] && res[0].length) {
        this.setState({ recipeCategoriesDDL: res[0] });
      }
      else {
        this.setState({ recipeCategoriesDDL: [] });
      }
      resolve();
    }).catch(err => err);
  }
  GetRecipes(resolve) {
    fetch(AppConfig.apiBaseUrl + "GetRecipes?id=" + window.AppSession.companyId).then(res => res.text()).then(res => {
      var res = JSON.parse(res);
      if (res.length && res[0] && res[0].length) {
        this.setState({ recipeMainList: res[0] });
      }
      else {
        this.setState({ recipeMainList: [] });
      }
      resolve();
    }).catch(err => err);
  }
  GetSupplies(resolve) {
    fetch(AppConfig.apiBaseUrl + "GetSupplies?id=" + window.AppSession.companyId).then(res => res.text()).then(res => {
      var res = JSON.parse(res);
      if (res.length && res[0] && res[0].length) {
        this.setState({ suppliesMainList: res[0] });
      }
      else {
        this.setState({ suppliesMainList: [] });
      }
      resolve();
    }).catch(err => err);
  }


 
  Save(e){
    e.preventDefault();
    var data={   
    id:this.state.id ,
    name: this.state.name,
    category_id: this.state.category_id,
    price: this.state.price,
    details: this.state.details,
    company_id:window.AppSession.companyId
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    fetch(AppConfig.apiBaseUrl + "AddUpdateBundle", requestOptions).then(res => res.text()).then(res => { 
     history.push("/recipes/bundles/index");
    }).catch(err => console.error(err));
      return false;

   
  }

  render() {
    return (
      <div>
            <Form Form onSubmit={e => this.Save(e)}>
        <Row>
          <ToastContainer />
          <Col md="6" style={{
            height: "auto",
          }}>
            <Card>
              <CardHeader>
                <CardTitle>Bundles Details</CardTitle>
              </CardHeader>
              <CardBody>
             
                  <FormGroup row>
                    <Col md="4">
                      <span>Bundle Name *</span>
                    </Col>
                    <Col md="8">
                      <Input type="text" required value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <span>Category *</span>
                    </Col>
                    <Col md="8">
                      <select required className="form-control" required value={this.state.category_id} onChange={e => this.setState({ category_id: e.target.value })}>
                        <option value="" >Select</option>
                        {this.state.recipeCategoriesDDL.map((option) => (
                          <option value={option.id} >{option.name}</option>
                        ))}
                      </select>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="4">
                      <span>Price</span>
                    </Col>
                    <Col md="8">{window.AppSession.currency} {this.state.price}</Col>
                  </FormGroup>

               
              </CardBody>
            </Card>
          </Col>
          <Col md='6' style={{paddingbottom: "4px",}}>
            <Card>
              <CardHeader>
                <CardTitle>Recipies</CardTitle>
              </CardHeader>
              <CardBody>
                <Select
                  getOptionLabel={option => option.name}
                  getOptionValue={option => option.id}
                  className="React" classNamePrefix="select" onChange={e => { this.RecipeChanged(e) }} label="name" options={this.state.recipeMainList} />
              </CardBody>
              <table className="table">
                <tbody>
                  {
                    _.filter(this.state.details, function (o) { return o.recipe_id != null }).map((item, i) =>
                      <tr>
                        <td>
                          <Icon.Delete onClick={e => { this.DeleteRecipe(e, item, i) }}></Icon.Delete>
                        </td>
                        <td>{item.name}
                          <br /> Per Item Cost:{window.AppSession.currency}{item.per_item_cost}
                        </td>
                        <td>
                          <Input type="number" value={item.qty} onChange={e => { this.UpdateRecipeQty(e, item, i) }} />
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>


            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplies</CardTitle>
              </CardHeader>
              <CardBody>

                <Select
                  className="React"
                  classNamePrefix="select"
                  name="type"
                  getOptionLabel={option => option.name}
                  getOptionValue={option => option.id}
                  onChange={e => { this.SuppliesChanged(e) }}
                  options={this.state.suppliesMainList}
                />
              </CardBody>
              <table className="table">
                {
                  _.filter(this.state.details, function (o) { return o.supplies_id != null }).map((item, i) =>
                    <tr>
                      <td>
                        <Icon.Delete onClick={e => { this.DeleteSupply(e, item, i) }}></Icon.Delete>
                      </td>
                      <td>{item.name}
                        <br /> Per Item Cost:{window.AppSession.currency}{item.per_item_cost}
                      </td>
                      <td>
                        <Input type="number" value={item.qty} onChange={e => { this.UpdateSupplyQty(e, item, i) }} />
                      </td>
                    </tr>
                  )
                }
              </table>
            </Card>
          </Col>
        </Row>
        <Row>
<Col md="12">
<Button className="btn btn-primary " color="primary" type="submit">Save</Button>
</Col>
        </Row>
        </Form>
      </div>
    )
  }
}

export default Bundles