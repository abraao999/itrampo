import React, { useMemo } from "react";
import styled from "styled-components";
import { FaWrench } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";

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

const ProviderBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e6e9f2;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 18px;
  text-align: left;
`;

const ProviderInfo = styled.p`
  margin: 6px 0;
  color: #344054;
  font-size: 14px;
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
  const selectedAppointment = useMemo(() => {
    const storedAppointment = localStorage.getItem("itrampo:selectedAppointment");

    return storedAppointment
      ? (JSON.parse(storedAppointment) as {
          service: string;
          specialtyName: string;
          date: string;
          time: string;
          provider: {
            id: string;
            companyName: string;
            name: string;
            phone: string;
            city?: string;
          };
        })
      : null;
  }, []);

  const handleAgendar = async () => {
    const storedUser = localStorage.getItem("itrampo:user");
    const user = storedUser
      ? (JSON.parse(storedUser) as { name?: string; email?: string; phone?: string })
      : null;

    if (!selectedAppointment) {
      alert("Selecione um prestador antes de agendar.");
      return;
    }

    try {
      await apiRequest("/api/appointments", {
        method: "POST",
        body: {
          service: selectedAppointment.specialtyName,
          company: selectedAppointment.provider.companyName,
          providerId: selectedAppointment.provider.id,
          providerName: selectedAppointment.provider.name,
          providerPhone: selectedAppointment.provider.phone,
          customerName: user?.name ?? "Cliente",
          customerEmail: user?.email,
          customerPhone: user?.phone,
          date: selectedAppointment.date,
          time: selectedAppointment.time
        }
      });

      alert("Serviço agendado com sucesso!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Nao foi possivel agendar.");
    }
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
        <SubLabel>{selectedAppointment?.specialtyName ?? "Servico selecionado"}</SubLabel>
        {selectedAppointment && (
          <SubLabel>
            {selectedAppointment.date} as {selectedAppointment.time}
          </SubLabel>
        )}
        <Price>R$150,00</Price>
      </Section>

      {selectedAppointment && (
        <ProviderBox>
          <Label>Prestador</Label>
          <ProviderInfo>
            <strong>Empresa:</strong> {selectedAppointment.provider.companyName}
          </ProviderInfo>
          <ProviderInfo>
            <strong>Responsavel:</strong> {selectedAppointment.provider.name}
          </ProviderInfo>
          <ProviderInfo>
            <strong>Telefone:</strong> {selectedAppointment.provider.phone}
          </ProviderInfo>
          <ProviderInfo>
            <strong>Cidade:</strong> {selectedAppointment.provider.city || "Nao informada"}
          </ProviderInfo>
        </ProviderBox>
      )}

      <Button primary onClick={handleAgendar}>
        Agendar
      </Button>

      <Button onClick={handleNegar}>Negar</Button>

      <Back to="/">← Voltar</Back>
    </Container>
  );
};

export default Servico;
