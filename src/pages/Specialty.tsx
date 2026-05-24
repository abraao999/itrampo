import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../assets/Logo.png";
import { apiRequest } from "../lib/api";

type SpecialtyData = {
  _id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
};

type ProviderData = {
  id: string;
  name: string;
  phone: string;
  companyName: string;
  specialtyName: string;
  city?: string;
  status: string;
};

type SelectedAppointment = {
  service: string;
  specialtyName: string;
  date: string;
  time: string;
  provider: ProviderData;
};

const fallbackNames: Record<string, string> = {
  encanador: "Encanador",
  pintor: "Pintor",
  eletricista: "Eletricista",
  pedreiro: "Pedreiro",
  diarista: "Diarista",
  jardineiro: "Jardineiro",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: min(100%, 420px);
  min-height: 100vh;
  margin: 0 auto;
  padding: 28px 20px;
  background: #ffffff;
  color: #172033;
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

const Button = styled.button<{ color: string }>`
  width: 100%;
  padding: 14px;
  background: ${(props) => props.color};
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const DateTimeWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  width: 100%;

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

const Status = styled.p`
  color: #555;
  font-weight: bold;
`;

const ProviderList = styled.div`
  display: grid;
  gap: 10px;
  width: 100%;
`;

const ProviderCard = styled.button<{ selected: boolean }>`
  width: 100%;
  border: 1px solid ${(props) => (props.selected ? "#1d4ed8" : "#e6e9f2")};
  border-radius: 8px;
  padding: 14px;
  background: ${(props) => (props.selected ? "#eef4ff" : "#ffffff")};
  color: #172033;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
`;

const ProviderName = styled.strong`
  display: block;
  font-size: 16px;
  margin-bottom: 4px;
`;

const ProviderMeta = styled.span`
  display: block;
  color: #667085;
  font-size: 13px;
  line-height: 1.45;
`;

const Specialty: React.FC = () => {
  const { specialtySlug = "encanador" } = useParams();
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState<SpecialtyData>({
    _id: specialtySlug,
    name: fallbackNames[specialtySlug] ?? "Especialidade",
    slug: specialtySlug,
    color: "#1d4ed8",
  });
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [date, setDate] = useState("2026-05-16");
  const [time, setTime] = useState("09:30");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  useEffect(() => {
    async function loadSpecialty() {
      try {
        const data = await apiRequest<{ specialty: SpecialtyData }>(
          `/api/specialties/${specialtySlug}`
        );

        setSpecialty(data.specialty);
      } catch {
        setSpecialty({
          _id: specialtySlug,
          name: fallbackNames[specialtySlug] ?? "Especialidade",
          slug: specialtySlug,
          color: "#1d4ed8",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadSpecialty();
  }, [specialtySlug]);

  useEffect(() => {
    async function loadProviders() {
      setIsLoadingProviders(true);

      try {
        const data = await apiRequest<{ providers: ProviderData[] }>(
          `/api/providers?specialtySlug=${specialtySlug}`
        );

        setProviders(data.providers);
        setSelectedProviderId(data.providers[0]?.id ?? "");
      } catch {
        setProviders([]);
        setSelectedProviderId("");
      } finally {
        setIsLoadingProviders(false);
      }
    }

    loadProviders();
  }, [specialtySlug]);

  const selectedProvider = providers.find(
    (provider) => provider.id === selectedProviderId
  );

  const handleSchedule = () => {
    if (selectedProvider) {
      const selectedAppointment: SelectedAppointment = {
        service: specialty.slug,
        specialtyName: specialty.name,
        date,
        time,
        provider: selectedProvider
      };

      localStorage.setItem(
        "itrampo:selectedAppointment",
        JSON.stringify(selectedAppointment)
      );
    }

    navigate("/servico");
  };

  return (
    <Container>
      <Header>
        <img src={logo} alt="" />
      </Header>

      {isLoading && <Status>Carregando especialidade...</Status>}

      <Section>
        <Label>Orcamento</Label>
        <SubLabel>Servico desejado</SubLabel>
        <Select value={specialty.slug} disabled>
          <option value={specialty.slug}>{specialty.name}</option>
        </Select>
      </Section>

      <Section>
        <SubLabel>Prestadores cadastrados</SubLabel>
        {isLoadingProviders && <Status>Carregando prestadores...</Status>}
        {!isLoadingProviders && providers.length === 0 && (
          <Status>Nenhum prestador cadastrado para esta especialidade.</Status>
        )}
        <ProviderList>
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              selected={provider.id === selectedProviderId}
              type="button"
              onClick={() => setSelectedProviderId(provider.id)}
            >
              <ProviderName>{provider.companyName}</ProviderName>
              <ProviderMeta>Responsavel: {provider.name}</ProviderMeta>
              <ProviderMeta>Telefone: {provider.phone}</ProviderMeta>
              <ProviderMeta>Cidade: {provider.city || "Nao informada"}</ProviderMeta>
            </ProviderCard>
          ))}
        </ProviderList>
      </Section>

      <Button
        color={specialty.color}
        disabled={!selectedProviderId}
        onClick={handleSchedule}
      >
        Agendar horario
      </Button>

      <DateTimeWrapper>
        <Input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <Input
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
        />
      </DateTimeWrapper>

      <Back to="/">Voltar</Back>
    </Container>
  );
};

export default Specialty;
