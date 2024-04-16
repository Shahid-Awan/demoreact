import React from "react";
import {
Button,
Form, 
FormGroup, 
Label, 
Input, 
FormText,
Row,
Col
} from "reactstrap"

class Recipes extends React.Component{
  render(){
    return (
        <div class="row" >
        <div className="center" style={{
            display: "flex",
            flexWrap: "wrap",
            left: "50%",
            top: "50%",
            margin: "-25% 0 0 -25%",
            position: "absolute",
            margintop: "-25%",
            border: "1px solid grey",
            padding: "20px 5px",
            borderRadius: "10px"
        }}>
        <Form>
        
        <FormGroup>
        <Label for="ingredients">Ingredient Name</Label>
        <Input type="text" name="ingredients" id="ingredients" placeholder="Enter Ingredients Name" />
        </FormGroup>
        
      
      <Row form>
       <Col md={6}>   
        <FormGroup>
        <Label for="purchasesize">Purchase Size</Label>
        <Input type="number" name="purchasesize" id="purchasesize" placeholder="0" />
        </FormGroup>
        </Col>
        <Col md={6}>
      <FormGroup>
        <Label for="measure">Measurement</Label>
        <Input type="number" name="measure" id="measure" placeholder="0"/>
      </FormGroup>
      </Col>
      </Row>

      <Row>
          <Col md={6}>
      <FormGroup>
        <Label for="cost">Cost Price</Label>
        <Input type="number" name="cost" id="cost" placeholder="0" />
        </FormGroup>
        </Col>
        <Col md={6}>
        <FormGroup>
        <div>
            <br/>
        € 0.00 per kg
        </div>
          
      </FormGroup>
      </Col>
      </Row>

      
      <FormGroup>
        <Label for="supplier">Supplier<FormText color="muted">
         Optional
        </FormText></Label>
        <Input type="text" name="supplier" id="supplier" placeholder="supplier" />
      </FormGroup>
      
      <FormGroup inline check>
      <Label check>
          <Input type="checkbox" />{' '}
          Add specific Volume / Weight value
        </Label>
      </FormGroup>


      <FormGroup row>
         <Col sm={3}>
         <FormText>One</FormText>
        <Input type="select">
        <option>Cup(US)</option>
        <option>Cup</option>
        <option>Tbl</option>
        <option>Tps</option>
        </Input>
        </Col>

        <Col sm={3}>
           <FormText>Has</FormText>
        <Input type="number" id="number" placeholder="0" />
        </Col>
        <Col sm={3}>
        <Input type="select">
        <option>g</option>
        <option>Oz</option>
        </Input>
        </Col>
        
      </FormGroup>
        <Row>
           
            <Col md={6} > 
      <Button color="success" className="float-left">cancle</Button>
      </Col>
      <Col md={6} >
          <Button color="success" className="float-right">Save</Button>
      </Col>
     
      </Row>
    </Form>
    </div>
    </div>
  )
}
    
  }


export default Recipes