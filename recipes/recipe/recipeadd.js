import React from "react"
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
  Table,
  CustomInput,
  FormText,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter

} from "reactstrap"

import queryString from 'query-string';
import Select from "react-select";
import * as Icon from "react-feather";
import { history } from "../../../history";
import DataTable from "react-data-table-component";
import { Search } from "react-feather"
import AppConfig from "../../../configs/appConfig";
import { ThemeConsumer } from "styled-components";
import _ from 'underscore';


let imageIndex = 0;
let recipeIndex = 0;

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

    receipeCategoriesDDL:[],
    ingredientMainList:[],   
    ingredientUnitDDL:[],
    filteredData: [],
    value: "",

    id:0 ,
    name:'',
    description:'',
    category_id:'',
    serving:'',
    cost:'',
    custom_price:'',
    directions:'',
    storage_information:'',
    allergen_nuts_notes:'',
    other_allergen:'',
    is_other_allergen:false,
    allergens:AppConfig.Allergens,
    images:[],
    ingredients:[],

    add_ingredientId:'',
    add_ingredientqty:'',
    add_ingredientcost:'',
    add_ingredientunit:'',
};
UploadPhoto(e){
  var formData = new FormData();
  formData.append(`file`,  e.target.files[0]); 
  fetch(AppConfig.apiBaseUrl + "UploadFile", {method: 'POST',body: formData})
    .then(response => response.json())
    .then(success => {           
      imageIndex+=1;
      var _images = this.state.images;
      _images.push({ id: imageIndex, path: success.data,actual_name:document.getElementById('uploadImg').files[0].name });
      this.setState(prevState => ({images: _images}));
      this.setState(prevState => ({photo: success.data}));
    }).catch(error => console.log(error)
  );  
}

componentDidMount() {
  var p1 = new Promise((resolve, reject) => { this.GetRecipeCategory(resolve); });
  var p2 = new Promise((resolve, reject) => { this.GetIngredients(resolve); });
  var p3 = new Promise((resolve, reject) => { this.GeIngredientUnits(resolve); });

  Promise.all([p1, p2,p3]).then(values => {
    let params = queryString.parse(this.props.location.search)
    if(params.id){      
      this.GetRecipe(params.id);    
    }
  });
}

GetRecipe(id){
  fetch(AppConfig.apiBaseUrl + "GetRecipe?id="+id).then(res => res.text()).then(res => {
    var res = JSON.parse(res);  
    if(res[0].length){
      var d=res[0][0];
      this.setState(prevState => ({
        id:d.id ,
        name:d.name,
        description:d.description,
        category_id:d.category_id,
        serving:d.serving,
        cost:d.cost,
        custom_price:d.custom_price,
        directions:d.directions,
        storage_information:d.storage_information,
        allergen_nuts_notes:d.allergen_nuts_notes,
        other_allergen:d.other_allergen,
        is_other_allergen:d.is_other_allergen,
        allergens:res[1],
        images:res[2],
        ingredients:res[3],
      }));
    }
  }).catch(err => err);
}
GetRecipeCategory(resolve){
  fetch(AppConfig.apiBaseUrl + "GetLookups?type="+AppConfig.LookupEnum.Recipes+"&company_id="+window.AppSession.companyId).then(res => res.text()).then(res => {
    var res = JSON.parse(res);
    if (res.length && res[0] && res[0].length) {
      this.setState({ receipeCategoriesDDL: res[0] });
    }
    else{
      this.setState({ receipeCategoriesDDL: [] });
    }
    resolve();
  }).catch(err => err);
}
GeIngredientUnits(resolve){
  fetch(AppConfig.apiBaseUrl + "GetLookups?type="+AppConfig.LookupEnum.IngredientUnit+"&company_id="+window.AppSession.companyId).then(res => res.text()).then(res => {
    var res = JSON.parse(res);
    if (res.length && res[0] && res[0].length) {
      this.setState({ ingredientUnitDDL: res[0] });
    }
    else{
      this.setState({ ingredientUnitDDL: [] });
    }
    resolve();
  }).catch(err => err);
}
GetIngredients(resolve){
  fetch(AppConfig.apiBaseUrl + "GetIngredients?id="+window.AppSession.companyId).then(res => res.text()).then(res => {
    var res = JSON.parse(res);
    if (res.length && res[0] && res[0].length) {
      this.setState({ ingredientMainList: res[0] });
    }
    else{
      this.setState({ ingredientMainList: [] });
    }
    resolve();
  }).catch(err => err);
}
    

  AddNew(){
    this.setState(prevState => ({
      addmodal: true,    
      add_ingredientId:'',
      add_ingredientqty:'',
      add_ingredientcost:'',
      add_ingredientunit:'',
    }));
  }
  CancelIngredient(){
    this.setState(prevState => ({
      addmodal: false,    
    }));
  }
  SaveIngredient(e){
   e.preventDefault();
    var _ingredients= this.state.ingredients;
var add_ingredientId=this.state.add_ingredientId;     
    var ing=_.filter(this.state.ingredientMainList,function(o){return o.id ==add_ingredientId })[0];

    _ingredients.push({
      name:ing.name,
      ingredient_id:this.state.add_ingredientId,
      qty:this.state.add_ingredientqty,
      unit:this.state.add_ingredientunit,
      cost:this.state.add_ingredientcost,
    })
    this.setState(prevState => ({addmodal: false,ingredients:_ingredients}));
    this.UpdateTotalIngredintCost(_ingredients);
return false;
  }

  UpdateTotalIngredintCost(ingredients){
  var total=0;
  for(var i=0;i<ingredients.length;i++){
    var item=ingredients[i];
    total+=(item.cost||0)*1;
  }
  this.setState(prevState => ({cost:total}));
}

ChangeIngredient(e){
  this.setState({ add_ingredientId: e.target.value }); 
  this.UpdateIngredientAddCost(e.target.value,this.state.add_ingredientqty );
}
ChangeIngredientQty(e){
  this.setState({ add_ingredientqty: e.target.value });
  this.UpdateIngredientAddCost(this.state.add_ingredientId, e.target.value );
}
UpdateIngredientAddCost(add_ingredientId,add_ingredientqty){
  debugger
  var ing=_.filter(this.state.ingredientMainList,function(o){return o.id == add_ingredientId})[0];
  if(ing){   
    var cost= (ing.cost||0) * (add_ingredientqty||0);
    this.setState({ add_ingredientunit:ing.unit,add_ingredientcost:cost});    
  }
  else{
    this.setState({ add_ingredientunit:''});
  }
}

DeleteIngredient(id) {
  debugger
  var _ingredients=  _.filter(this.state.ingredients,function(o){return o.ingredient_id!=id});
  this.setState(prevState => ({ingredients:_ingredients}));
  this.UpdateTotalIngredintCost(_ingredients);
}

  toggleModal = () => {
    this.setState(prevState => ({
      addmodal: !prevState.addmodal
    }))
  }


  Save(e){
    e.preventDefault();
    var data={   
      id:this.state.id ,
      name:this.state.name,
      description:this.state.description,
      category_id:this.state.category_id,
      serving:this.state.serving,
      cost:this.state.cost,
      custom_price:this.state.custom_price,
      directions:this.state.directions,
      storage_information:this.state.storage_information,
      allergen_nuts_notes:this.state.allergen_nuts_notes,
      other_allergen:this.state.other_allergen,
      is_other_allergen:this.state.is_other_allergen,
      allergens:this.state.allergens,
      images:this.state.images,
      ingredients:this.state.ingredients,
      compay_id:window.AppSession.companyId,
      
    };
    
      
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    fetch(AppConfig.apiBaseUrl + "AddUpdateRecipe", requestOptions).then(res => res.text()).then(res => {
      
      history.push("/recipes/recipe/index")
    }).catch(err => console.error(err));
      return false;

  }
  DeleteImage(id){
    var imageList = this.state.images;
    imageList = _.filter(imageList, function (o) { return o.id != id });
    this.setState(prevState => ({
        images: imageList,
    }));
  }

  render(){
    return (
        <div className="firstRow">
       <Form Form onSubmit={e => this.Save(e)}>
       
        <Row>
        <Col md="6"> 
        <Card>
        <CardHeader>
          <CardTitle>Recipe Information</CardTitle>
        </CardHeader>
        <CardBody>
          <Form>
            <FormGroup row>
              <Col md="4">
                <span>Name *</span>
              </Col>
              <Col md="8">
                <Input type="text" required   placeholder="Recipe Name" 
                value={this.state.name} onChange={e => this.setState({ name: e.target.value })}/>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="4">
                <span>Description</span>
              </Col>
              <Col md="8">
                <Input  placeholder="Enter Description Here"
                value={this.state.description} onChange={e => this.setState({ description: e.target.value })}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="4">
                <span>Category *</span>
              </Col>
              <Col md="8">

              <select className="form-control" required value={this.state.category_id}  onChange={e => this.setState({ category_id: e.target.value })}>
              <option value="" >Select</option>
                                                            {this.state.receipeCategoriesDDL.map((option) => (
                                                              <option value={option.id} >{option.name}</option>
                                                              ))}
                                                            </select>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="4">
                <span>Serving</span>
              </Col>
              <Col md="6">
                <Input
                  type="text"
                  value={this.state.serving} required onChange={e => this.setState({ serving: e.target.value })}
                  placeholder="0"
     
                />
                </Col>
                <Col md="2" className="mt-1">
                <Icon.AlertCircle size={22} />
              </Col>
            </FormGroup>


            <FormGroup row>
              <Col md="4">
                <span>Cost Price</span>
              </Col>
              <Col md="8">
                <p> {window.AppSession.currency}  {this.state.cost} </p>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="4">
                <span>Custom Price</span>
              </Col>
              <Col md="6">
                <Input  placeholder="0"
                    value={this.state.custom_price} onChange={e => this.setState({ custom_price: e.target.value })}
                />
                </Col>
                <Col md="2" className="mt-1">
                <Icon.AlertCircle size={22} />
              </Col>
            </FormGroup>



            <FormGroup row>
              <Col md={{ size: 8, offset: 4 }}>
              <p><Icon.AlertCircle size={16} />
               Your 'Custom Price' should be the same as your 'Cost Price',
               unless you add in a buffer for ingredient price changes.
                 
              </p>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md={{ size: 12 }}>
              <h4>
               Image Upload
                 
              </h4>
              </Col>
            </FormGroup>

            <FormGroup row>


            <Button.Ripple className="mr-1 block" color="primary "  onClick={() => {document.getElementById('uploadImg').click() }}>Upload Images</Button.Ripple>
                <Input type="file" name="file" id="uploadImg" onChange={(e) => {this.UploadPhoto(e) }} hidden />
            </FormGroup>
            <FormGroup row>
              <Col md={{ size: 12 }}>
           <table className="table table-bordered">
           {this.state.images.map((item) => (
                 <tr>
                     <td><Icon.Delete onClick={e => this.DeleteImage(item.id)}></Icon.Delete></td>
                     <td><a href={AppConfig.uploadBaseUrl+item.path} target="_blank">{item.actual_name}</a></td>
                  </tr>
              ))}
           </table>
              </Col>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
      </Col>
      <Col md="6">
          {/*   <Card>
        <CardHeader className="row ">
          
        <Col lg="6" sm="6" md="6">
        <CardTitle>ingredients</CardTitle>
        </Col>
        <Col className="text-right" lg="6" sm="6" md="6">
        <Button.Ripple color="primary" onClick={e => this.AddNew()}>Add Ingredients</Button.Ripple>
        </Col>
            
              
        </CardHeader>
        <CardBody>
            <Table>
                <thead>
                    <th>Qty</th>
                    <th colSpan="2">Ingredient</th>
                    <th>Qty</th>
                </thead>
                <tbody></tbody>
            </Table>
            
           
        </CardBody>
        <div style={{
             paddingleft:"200px",
             alignItems:"center",
             fontSize:"30px",
             textAlign:"center",
             paddingBottom:"20px",
            
             
           }}  >
          
           <FontAwesomeIcon icon={faExclamationCircle}/>
           
              <h5 style={{
                padding:"10px",
                fontWeight:"normal",
              }}> Search your recipe list and add them to your bundle</h5>
          </div>
        </Card> */}

            <Card>
                <CardHeader className="row ">
                    <Col lg="6" sm="6" md="6">
                        <CardTitle>Ingredients</CardTitle>
                    </Col>
                    <Col className="text-right" lg="6" sm="6" md="6">
                        <Button.Ripple color="primary" onClick={e => this.AddNew()}>Add ingredients</Button.Ripple>
                    </Col>
                </CardHeader>
                <CardBody className="rdt_Wrapper">
                <table className="table table-bordered">
           {this.state.ingredients.map((item) => (
                 <tr>
                     <td><Icon.Delete onClick={e => this.DeleteIngredient(item.ingredient_id)}></Icon.Delete></td>
                     <td>
                       {item.name} <br/> Qty: {item.qty} 
                     </td>
                     <td>{window.AppSession.currency} {item.cost}</td>
                  </tr>
              ))}
           </table>
                </CardBody>
            </Card>



        </Col>
      </Row>
      
      <Row>
          <Col md="12">
              <Card>
                  <CardHeader>
                  <CardTitle>Recipe Directions</CardTitle>
                  </CardHeader>
                  <CardBody>
                      <Input type="textarea" rows="10" name="textarea"
                      value={this.state.directions} onChange={e => this.setState({ directions: e.target.value })}
                      placeholder="Enter Discription Here To Follow To Making Recipe"></Input>
                  </CardBody>
              </Card>
          </Col>
      </Row>




      <Row>
        <Col md="6"> 
        <Card>
        <CardHeader>
          <CardTitle>Allergens</CardTitle>
        </CardHeader>
        <CardBody>
        
       

        <Form>
      <FormGroup>
        <p><b>Please select which allergans are applicable to this recipe</b></p>
        <div className="Col-group-left" style={{
            paddingleft:"55px",
            float:"left"}}>
              {this.state.allergens.map((item, i) =>
                   <span><CustomInput type="checkbox" value={item.name} checked={item.isactive} 
                   onChange={e => { var _allergens = this.state.allergens; _allergens[i].isactive = e.target.checked; this.setState(prevState => ({ allergens: _allergens })) }}
                   id={'allergen_'+item.name} label={item.name} /><br/></span>
                )}
        </div>       
      </FormGroup>
      <FormGroup>
            <Input type="text" placeholder="ETC, Brazil, walnut"
            value={this.state.allergen_nuts_notes} onChange={e => this.setState({ allergen_nuts_notes: e.target.value })}
            ></Input>
      </FormGroup>
      <FormGroup>
        <div>
          <CustomInput type="checkbox" id="Checkbox9" label="Others" 
          checked={this.state.is_other_allergen}
          onChange={e => this.setState({ is_other_allergen: e.target.checked })}
          />
        </div>
      </FormGroup>
      <FormGroup>
            <Input type="text" placeholder="Enter Other Allergen Details"
               value={this.state.other_allergen} onChange={e => this.setState({ other_allergen: e.target.value })}
            ></Input>
      </FormGroup>
      </Form>


        </CardBody>
      </Card>
      </Col>
      <Col md="6">
            <Card>
        <CardHeader>
          <CardTitle>
              Storage Information
              </CardTitle>
        </CardHeader>
        <CardBody>
            <Input type="textarea" value={this.state.storage_information} onChange={e => this.setState({ storage_information: e.target.value })} rows="10" placeholder="Enter Storage Informatio Here"></Input>
        </CardBody>
        </Card>



        </Col>
      </Row>
     
     <Row>
       <Col lg="12">
       <Button className="mb-10"  color="primary "  className="btn" type="submit" >
                      Save
                    </Button>
                    
       </Col>
     </Row>
     <br/>
      </Form>
      <Modal
       isOpen={this.state.addmodal}
       toggle={this.toggleModal}
       className="modal-dialog-centered"
                >
                  <ModalHeader toggle={this.toggleModal}>
                    Select Ingredient
                  </ModalHeader>
                <Form Form onSubmit={e => this.SaveIngredient(e)}>

                <ModalBody>
               <Row>
         <Col md="12">
         <FormGroup>
        <Label for="ingredients">Search Ingredient</Label>
        
        <select required className="form-control"  value={this.state.add_ingredientId}  onChange={e => this.ChangeIngredient(e)}>
              <option value="" >Select</option>
                                                            {this.state.ingredientMainList.map((option) => (
                                                              <option value={option.id} >{option.name}</option>
                                                              ))}
                                                            </select>
        </FormGroup>
        
      
      <Row form>
       <Col md={6}>   
        <FormGroup>
        <Label for="purchasesize">Quantity</Label>
        <Input type="number" required name="purchasesize" id="purchasesize" placeholder="0"   onChange={e => this.ChangeIngredientQty(e)}  value={this.state.add_ingredientqty} />
        </FormGroup>
        </Col>
        <Col md={6}>
      <FormGroup>
        <Label for="measure">Measurement</Label>

        <select required className="form-control"  value={this.state.add_ingredientunit}  onChange={e => this.setState({ add_ingredientunit: e.target.value })}>
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
        <Label for="cost">Cost Price : </Label>
        {window.AppSession.currency}  {this.state.add_ingredientcost}
        </FormGroup>
        </Col>
        <Col md={6}>
       
      </Col>
      </Row>           
           </Col>       
       
               </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Row class="clearfix">
                  <Col md={6}>
                
                    </Col>
                    <Col md={6}>
                    <Button className="btn btn-success float-right" type="submit" >
                      Save
                    </Button>
                    </Col>
                    </Row>
                  </ModalFooter>
                

                </Form>
      </Modal>
      
      </div>
      
    )
  }
}

export default Recipes