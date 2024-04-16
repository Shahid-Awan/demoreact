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
  
  } from "reactstrap"

import { history } from "../../history";
import { tableBasic } from "./TableSourceCode";



class Recipes extends React.Component{
  state = {
    activeTab: "1"
  }
  render() {
    return (
      <React.Fragment>
        <Row>
          <Col>
          <div className="bg-primary clearfix" style={{ padding: '.5rem' }}>
               <a onClick={() => history.push("/recipes/add")}>

                <Button className="btn btn-secondary float-right">ADD Recipie </Button>{' '}


          </a>

          </div>
          </Col>
        </Row>
          <Card>
          <CardHeader>
            <CardTitle>Table Basic</CardTitle>
            <div className="views">
              <Nav tabs>
                
              
              </Nav>
            </div>
          </CardHeader>
          <CardBody>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>Larry</td>
                      <td>the Bird</td>
                      <td>@twitter</td>
                    </tr>
                  </tbody>
                </Table>
              </TabPane>
               <TabPane className="component-code" tabId="2">{tableBasic}</TabPane>
            </TabContent>
          </CardBody>
        </Card>
        
      </React.Fragment>
    )
  }
}

export default Recipes