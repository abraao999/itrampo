import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Back = styled(Link)`
  margin-top: 20px;
  color: #2563eb;
  text-decoration: none;
  font-weight: bold;
`;

const Diarista: React.FC = () => {
  return (
    <Container>
      <Title>Página do Encanador</Title>
      <p>Aqui você pode adicionar descrição, contatos ou agendamento.</p>
      <Back to="/">← Voltar</Back>
    </Container>
  );
};

export default Diarista;
