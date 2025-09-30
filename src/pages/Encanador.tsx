import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
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
  margin-bottom: 20px;
`;

const Section = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const SubLabel = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #1d4ed8;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;

const DateTimeWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;

  input {
    flex: 1;
  }
`;

const Back = styled(Link)`
  margin-top: 20px;
  color: #2563eb;
  text-decoration: none;
  font-weight: bold;
`;

const Encanador: React.FC = () => {
  const [service, setService] = useState("encanador");
  const [company, setCompany] = useState("LS Conexões");
  const [date, setDate] = useState("2025-10-01");
  const [time, setTime] = useState("09:30");

  const navigate = useNavigate(); // 🔹 inicializa o hook

  const handleSubmit = () => {
    // se quiser, pode salvar dados em contexto/estado global antes de navegar
    navigate("/servico"); // 🔹 redireciona para a página de serviço
  };
  return (
    <Container>
      <Header>
        <img src={logo} alt="" />
      </Header>

      <Section>
        <Label>Orçamento</Label>
        <SubLabel>Qual é o serviço desejado?</SubLabel>
        <Select value={service} onChange={(e) => setService(e.target.value)}>
          <option value="encanador">Encanador</option>
          <option value="pintor">Pintor</option>
          <option value="eletricista">Eletricista</option>
          <option value="pedreiro">Pedreiro</option>
          <option value="diarista">Diarista</option>
          <option value="jardineiro">Jardineiro</option>
        </Select>
      </Section>

      <Section>
        <SubLabel>Selecione a empresa?</SubLabel>
        <Select value={company} onChange={(e) => setCompany(e.target.value)}>
          <option value="encanador">LS CONEXÕES</option>
          <option value="pintor">HELP HIDRAULICAS</option>
          <option value="pintor">PLENSEG</option>
          <option value="pintor">CLEITON EDIFICAÇÕES</option>
        </Select>
      </Section>

      <Button onClick={handleSubmit}>Agendar horário</Button>

      <DateTimeWrapper>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </DateTimeWrapper>

      <Back to="/">← Voltar</Back>
    </Container>
  );
};

export default Encanador;
