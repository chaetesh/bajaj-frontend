import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Dropdown,
  DropdownButton,
  Alert,
  ListGroup,
  Navbar,
  Nav,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const jsonData = JSON.parse(input);
      if (!jsonData || !Array.isArray(jsonData.data)) {
        throw new Error("Invalid JSON format");
      }
      setError(null);
      const result = await axios.post("http://localhost:3000/bfhl", jsonData);
      setResponse(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelect = (eventKey) => {
    const selected = eventKey.split(",");
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!response) return null;
    const { numbers, alphabets, highest_alphabet } = response;
    const filteredData = [];
    if (selectedOptions.includes("Alphabets")) {
      filteredData.push(...alphabets);
    }
    if (selectedOptions.includes("Numbers")) {
      filteredData.push(...numbers);
    }
    if (selectedOptions.includes("Highest alphabet")) {
      filteredData.push(...highest_alphabet);
    }
    return (
      <ListGroup>
        {filteredData.map((item, index) => (
          <ListGroup.Item key={index}>{item}</ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">AP21110010079</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Form>
          <Form.Group controlId="jsonInput">
            <Form.Label>API Input</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={input}
              onChange={handleInputChange}
              placeholder='{"data": ["A", "C", "z"]}'
            />
          </Form.Group>
          <Button className="mt-2" variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
        {response && (
          <>
            <DropdownButton
              id="dropdown-basic-button"
              title="Select Data to Display"
              className="mt-5 mb-3"
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="Alphabets">Alphabets</Dropdown.Item>
              <Dropdown.Item eventKey="Numbers">Numbers</Dropdown.Item>
              <Dropdown.Item eventKey="Highest alphabet">
                Highest alphabet
              </Dropdown.Item>
            </DropdownButton>
            {renderResponse()}
          </>
        )}
      </Container>
    </>
  );
}

export default App;
