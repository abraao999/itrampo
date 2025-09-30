import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  FaWrench,
  FaPaintRoller,
  FaBolt,
  FaHammer,
  FaBroom,
  FaLeaf,
} from "react-icons/fa";
import logo from "../assets/Logo.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 150px);
  gap: 20px;
`;

const Card = styled(Link)<{ color: string }>`
  background: ${(props) => props.color};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  svg {
    font-size: 32px;
    margin-bottom: 10px;
  }
`;

const Home: React.FC = () => {
  return (
    <Container>
      <Header>
        <img src={logo} alt="" />
      </Header>

      <Grid>
        <Card to="/encanador" color="#2563eb">
          <FaWrench />
          Encanador
        </Card>
        <Card to="/encanador" color="#dc2626">
          <FaPaintRoller />
          Pintor
        </Card>
        <Card to="/encanador" color="#f59e0b">
          <FaBolt />
          Eletricista
        </Card>
        <Card to="/encanador" color="#92400e">
          <FaHammer />
          Pedreiro
        </Card>
        <Card to="/encanador" color="#6d28d9">
          <FaBroom />
          Diarista
        </Card>
        <Card to="/encanador" color="#f97316">
          <FaLeaf />
          Jardineiro
        </Card>
      </Grid>
    </Container>
  );
};

export default Home;
