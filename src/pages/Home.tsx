import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  FaWrench,
  FaPaintRoller,
  FaBolt,
  FaHammer,
  FaBroom,
  FaLeaf,
  FaUser,
} from "react-icons/fa";
import logo from "../assets/Logo.png";
import { apiRequest } from "../lib/api";

type Specialty = {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
};

const iconMap = {
  wrench: FaWrench,
  "paint-roller": FaPaintRoller,
  bolt: FaBolt,
  hammer: FaHammer,
  broom: FaBroom,
  leaf: FaLeaf,
};

const fallbackSpecialties: Specialty[] = [
  { _id: "encanador", name: "Encanador", slug: "encanador", icon: "wrench", color: "#2563eb" },
  { _id: "pintor", name: "Pintor", slug: "pintor", icon: "paint-roller", color: "#dc2626" },
  { _id: "eletricista", name: "Eletricista", slug: "eletricista", icon: "bolt", color: "#f59e0b" },
  { _id: "pedreiro", name: "Pedreiro", slug: "pedreiro", icon: "hammer", color: "#92400e" },
  { _id: "diarista", name: "Diarista", slug: "diarista", icon: "broom", color: "#6d28d9" },
  { _id: "jardineiro", name: "Jardineiro", slug: "jardineiro", icon: "leaf", color: "#f97316" },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100%, 360px);
  margin-bottom: 30px;
`;

const LoginLink = styled(Link)`
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #1d4ed8;
  color: #ffffff;
  text-decoration: none;
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

const Status = styled.p`
  color: #667085;
  font-weight: 700;
`;

const Home: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>(fallbackSpecialties);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadSpecialties() {
      try {
        const data = await apiRequest<{ specialties: Specialty[] }>("/api/specialties");

        setSpecialties(data.specialties);
        setHasError(false);
      } catch {
        setSpecialties(fallbackSpecialties);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadSpecialties();
  }, []);

  return (
    <Container>
      <Header>
        <img src={logo} alt="" />
        <LoginLink to="/login" aria-label="Entrar">
          <FaUser />
        </LoginLink>
      </Header>

      {isLoading && <Status>Carregando especialidades...</Status>}
      {hasError && <Status>Mostrando especialidades padrao.</Status>}

      <Grid>
        {specialties.map((specialty) => {
          const Icon = iconMap[specialty.icon as keyof typeof iconMap] ?? FaWrench;

          return (
            <Card key={specialty._id} to={`/${specialty.slug}`} color={specialty.color}>
              <Icon />
              {specialty.name}
            </Card>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Home;
