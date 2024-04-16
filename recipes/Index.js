import React from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Progress
} from "reactstrap"
import category_ingredients from "../../assets/img/icons/category_ingredients.jpg"
import category_master_ingredients from "../../assets/img/icons/category_master_ingredients.jpg"
import category_materials from "../../assets/img/icons/category_materials.jpg"
import category_my_bundles from "../../assets/img/icons/category_my_bundles.jpg"
import category_recipes from "../../assets/img/icons/category_recipes.jpg"
import { history } from "../../history"
class Index extends React.Component {

  render() {
    return (
      <Row>
        <Col lg="4" md="6" sm="12">
          <a onClick={() => history.push("/recipes/recipe/index")}>
            <Card>
              <CardHeader className="mx-auto">
                <div className="">
                  <img src={category_recipes} alt="avatarImg" />
                </div>
              </CardHeader>
              <CardBody className="text-center">
                <h4>Recipe Book</h4>
                <p>Use the recipe book to add & manage all your favourite recipes.</p>
              </CardBody>
            </Card>
          </a>
        </Col>
        <Col lg="4" md="6" sm="12">
          <a onClick={() => history.push("/recipes/ingredients/index")}>
            <Card>
              <CardHeader className="mx-auto">
                <div className="">
                  <img src={category_ingredients} alt="avatarImg" />
                </div>
              </CardHeader>
              <CardBody className="text-center">
                <h4>Ingredients</h4>
                <p>Add or edit ingredients in your master list & use it to create your recipes.</p>
              </CardBody>
            </Card>
          </a>
        </Col>
        <Col lg="4" md="6" sm="12">
          <a onClick={() => history.push("/recipes/supplies/index")}>
            <Card>
              <CardHeader className="mx-auto">
                <div className="">
                  <img src={category_materials} alt="avatarImg" />
                </div>
              </CardHeader>
              <CardBody className="text-center">
                <h4>Supplies List</h4>
                <p>Add supplies such as boards, boxes & ribbons & add them in your orders.</p>
              </CardBody>
            </Card>
          </a>
        </Col>
        <Col lg="4" md="6" sm="12">
          <a onClick={() => history.push("/recipes/master/index")}>
            <Card>
              <CardHeader className="mx-auto">
                <div className="">
                  <img src={category_master_ingredients} alt="avatarImg" />
                </div>
              </CardHeader>
              <CardBody className="text-center">
                <h4>Master Ingredient List</h4>
                <p>Pick from a list of pre-converted ingredients and add them to your list.</p>
              </CardBody>
            </Card>
          </a>
        </Col>
        <Col lg="4" md="6" sm="12">
          <a onClick={() => history.push("/recipes/bundles/index")}>
            <Card>
              <CardHeader className="mx-auto">
                <div className="">
                  <img src={category_my_bundles} alt="avatarImg" />
                </div>
              </CardHeader>
              <CardBody className="text-center">
                <h4>My Bundles</h4>
                <p>Bundle recipes & supplies together to make adding them to your order easier.</p>
              </CardBody>
            </Card>
          </a>
        </Col>
      </Row>
    )
  }
}
export default Index