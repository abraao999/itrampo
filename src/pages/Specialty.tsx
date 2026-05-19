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

const fallbackNames: Record<string, string> = {
  encanador: "Encanador",
  pintor: "Pintor",
  eletricista: "Eletricista",
  pedreiro: "Pedreiro",
  diarista: "Diarista",
  jardineiro: "Jardineiro",
};

const companyOptions: Record<string, string[]> = {
  encanador: ["LS Conexoes", "Help Hidraulicas", "Plenseg"],
  pintor: ["Pintura Express", "Casa Nova Pinturas", "Acabamento Pro"],
  eletricista: ["Luz Forte Eletrica", "Volts Service", "Instalacoes Seguras"],
  pedreiro: ["Cleiton Edificacoes", "Obra Certa", "Reforma Rapida"],
  diarista: ["Diarista Prime", "Casa Limpa", "Organiza Facil"],
  jardineiro: ["Verde Vivo", "Jardim Prime", "Raiz Paisagismo"],
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

const Specialty: React.FC = () => {
  const { specialtySlug = "encanador" } = useParams();
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState<SpecialtyData>({
    _id: specialtySlug,
    name: fallbackNames[specialtySlug] ?? "Especialidade",
    slug: specialtySlug,
    color: "#1d4ed8",
  });
  const [company, setCompany] = useState("");
  const [date, setDate] = useState("2026-05-16");
  const [time, setTime] = useState("09:30");
  const [isLoading, setIsLoading] = useState(true);

  const companies = companyOptions[specialty.slug] ?? ["Empresa parceira"];

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
    setCompany(companies[0] ?? "");
  }, [companies]);

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
        <SubLabel>Selecione a empresa</SubLabel>
        <Select value={company} onChange={(event) => setCompany(event.target.value)}>
          {companies.map((companyName) => (
            <option key={companyName} value={companyName}>
              {companyName}
            </option>
          ))}
        </Select>
      </Section>

      <Button color={specialty.color} onClick={() => navigate("/servico")}>
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
