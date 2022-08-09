import axios from "axios";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
const AddProduct = () => {
const [title, setTitle] = useState('');
const [price, setPrice] = useState('');
const history = useHistory();
const saveProduct = async (e) => {

e.preventDefault();

await axios.post('http://localhost:8080/products (http://localhost:8080/products)',{

title: title,

price: price

});

history.push("/");

}
return (
<form onSubmit={ saveProduct }>

<div className="field">

<label className="label">Price</label>
<input

type="text"

className="input"

value={ price }

onChange={ (e) => setPrice(e.target.value) }

placeholder="Price"

/>

</div>

<div className="field">

<button className="button is-primary">Save</button>

</div>
</form>


)
}



export default AddProduct;








// import Button from 'react-bootstrap/Button';
// import Col from 'react-bootstrap/Col';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import Row from 'react-bootstrap/Row';
// import FooterNav from './FooterNav';
// import NavBar from './NavBar';

// function AddProduct() {
//   return (
//     <>

//       <Container fluid>
//         <NavBar />
//         <Row className='mt-5'>
//           <Col sm={12}>
//             <h4 className='mt-4'>Add Product</h4>
//             <hr />
//           </Col>
//         </Row>

//         <Row>
//           <Col sm={12}>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Product Name</Form.Label>
//                 <Form.Control type="text" placeholder="Enter Product Name" />
//               </Form.Group>
//               <Button className='btn btn-sm' variant="success" type="submit">
//                 Save
//               </Button>
//             </Form>
//           </Col>
//         </Row>
//         <FooterNav />
//       </Container>
      
//     </>
//   );
// }

// export default AddProduct;