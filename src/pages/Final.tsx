import React from "react";
import styled from "styled-components";
import { FaWrench } from "react-icons/fa";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.div`
  width: 50px;
  height: 50px;
  background: #f06d2f;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;

  svg {
    color: white;
    font-size: 24px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #1d4ed8;
`;

const Section = styled.div`
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
`;

const Label = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const SubLabel = styled.p`
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
`;

const Price = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Button = styled.button<{ primary?: boolean }>`
  width: 100%;
  padding: 14px;
  background: ${(props) => (props.primary ? "#1d4ed8" : "#f1f1f1")};
  color: ${(props) => (props.primary ? "white" : "#1d4ed8")};
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 12px;

  &:hover {
    background: ${(props) => (props.primary ? "#2563eb" : "#e5e7eb")};
  }
`;

const Back = styled(Link)`
  margin-top: 20px;
  color: #2563eb;
  text-decoration: none;
  font-weight: bold;
`;

const Servico: React.FC = () => {
  const handleAgendar = () => {
    alert("Serviço agendado com sucesso!");
  };

  const handleNegar = () => {
    alert("Serviço negado.");
  };

  return (
    <Container>
      <Header>
        <Logo>
          <FaWrench />
        </Logo>
        <Title>Itrampo</Title>
      </Header>

      <Section>
        <Label>Serviço</Label>
        <SubLabel>Reparo de vazamento</SubLabel>
        <Price>R$150,00</Price>
      </Section>

      <Button primary onClick={handleAgendar}>
        Agendar
      </Button>

      <Button onClick={handleNegar}>Negar</Button>

      <Back to="/">← Voltar</Back>
    </Container>
  );
};

export default Servico;
