import React, { useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaSignOutAlt, FaTools } from "react-icons/fa";
import logo from "../assets/Logo.png";

type Provider = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  specialtyName: string;
  city?: string;
  status: string;
};

const Page = styled.main`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  background: #f6f7fb;
  color: #172033;
`;

const Shell = styled.div`
  width: min(100%, 460px);
  padding: 24px 20px 36px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Logo = styled.img`
  height: 58px;
`;

const IconButton = styled.button`
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #1d4ed8;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
`;

const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 28px;
`;

const Subtitle = styled.p`
  margin: 0 0 22px;
  color: #667085;
`;

const Card = styled.section`
  background: #ffffff;
  border: 1px solid #e6e9f2;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 14px;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
`;

const CardTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 18px;
`;

const Info = styled.p`
  margin: 8px 0;
  color: #344054;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const Metric = styled.div`
  border-radius: 8px;
  background: #eef4ff;
  padding: 14px;
`;

const MetricValue = styled.strong`
  display: block;
  color: #1d4ed8;
  font-size: 24px;
`;

const MetricLabel = styled.span`
  color: #667085;
  font-size: 13px;
  font-weight: 700;
`;

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const provider = useMemo(() => {
    const storedProvider = localStorage.getItem("itrampo:provider");
    return storedProvider ? (JSON.parse(storedProvider) as Provider) : null;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("itrampo:providerToken");
    localStorage.removeItem("itrampo:provider");
    navigate("/prestador/login", { replace: true });
  };

  return (
    <Page>
      <Shell>
        <Header>
          <Logo src={logo} alt="Itrampo" />
          <IconButton aria-label="Sair" onClick={handleLogout}>
            <FaSignOutAlt />
          </IconButton>
        </Header>

        <Title>Area do prestador</Title>
        <Subtitle>
          {provider
            ? `Ola, ${provider.name}.`
            : "Acompanhe seus pedidos e oportunidades."}
        </Subtitle>

        <Card>
          <CardTitle>
            <FaTools />
            Cadastro
          </CardTitle>
          <Info>
            <strong>Empresa:</strong> {provider?.companyName ?? "-"}
          </Info>
          <Info>
            <strong>Especialidade:</strong> {provider?.specialtyName ?? "-"}
          </Info>
          <Info>
            <strong>Telefone:</strong> {provider?.phone ?? "-"}
          </Info>
          <Info>
            <strong>Cidade:</strong> {provider?.city || "-"}
          </Info>
          <Info>
            <strong>Status:</strong> {provider?.status ?? "-"}
          </Info>
        </Card>

        <Card>
          <CardTitle>
            <FaCalendarCheck />
            Solicitações
          </CardTitle>
          <MetricGrid>
            <Metric>
              <MetricValue>0</MetricValue>
              <MetricLabel>Novas</MetricLabel>
            </Metric>
            <Metric>
              <MetricValue>0</MetricValue>
              <MetricLabel>Agendadas</MetricLabel>
            </Metric>
          </MetricGrid>
        </Card>
      </Shell>
    </Page>
  );
};

export default ProviderDashboard;
