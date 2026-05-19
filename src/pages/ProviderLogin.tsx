import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBriefcase, FaEye, FaEyeSlash, FaTools } from "react-icons/fa";
import logo from "../assets/Logo.png";
import { apiRequest } from "../lib/api";

type Specialty = {
  _id: string;
  name: string;
  slug: string;
};

type ProviderAuthResponse = {
  token: string;
  provider: {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyName: string;
    specialtyName: string;
    specialtySlug: string;
    city?: string;
    status: string;
  };
};

const Page = styled.main`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  background: #f5f7fb;
  color: #172033;
`;

const Shell = styled.div`
  width: min(100%, 440px);
  padding: 28px 20px 36px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const IconLink = styled(Link)`
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #1d4ed8;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
`;

const Logo = styled.img`
  height: 58px;
  object-fit: contain;
`;

const Spacer = styled.div`
  width: 42px;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f06d2f;
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 30px;
  line-height: 1.15;
`;

const Subtitle = styled.p`
  margin: 0 0 22px;
  color: #667085;
  font-size: 15px;
`;

const Panel = styled.form`
  background: #ffffff;
  border: 1px solid #e6e9f2;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
`;

const Segmented = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 4px;
  border-radius: 8px;
  background: #eef2f7;
  margin-bottom: 18px;
`;

const SegmentButton = styled.button<{ active: boolean }>`
  border: 0;
  border-radius: 6px;
  padding: 10px;
  background: ${(props) => (props.active ? "#ffffff" : "transparent")};
  color: ${(props) => (props.active ? "#1d4ed8" : "#667085")};
  font-weight: 800;
  box-shadow: ${(props) =>
    props.active ? "0 4px 12px rgba(15, 23, 42, 0.08)" : "none"};
`;

const Field = styled.label`
  display: block;
  margin-bottom: 14px;
  color: #344054;
  font-size: 14px;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  margin-top: 7px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  padding: 13px 12px;
  color: #172033;
  background: #ffffff;
  font-size: 15px;
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  margin-top: 7px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  padding: 13px 12px;
  color: #172033;
  background: #ffffff;
  font-size: 15px;
`;

const PasswordField = styled.div`
  position: relative;
`;

const PasswordButton = styled.button`
  position: absolute;
  right: 8px;
  bottom: 7px;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #667085;
`;

const SubmitButton = styled.button`
  width: 100%;
  border: 0;
  border-radius: 8px;
  padding: 14px;
  margin-top: 4px;
  background: #1d4ed8;
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
`;

const Message = styled.p<{ error?: boolean }>`
  margin: 14px 0 0;
  color: ${(props) => (props.error ? "#b42318" : "#067647")};
  font-size: 14px;
  font-weight: 700;
`;

const CustomerLink = styled(Link)`
  display: inline-flex;
  margin-top: 16px;
  color: #1d4ed8;
  font-weight: 800;
  text-decoration: none;
`;

const ProviderLogin: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [specialtySlug, setSpecialtySlug] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("itrampo:providerToken");

    if (token) {
      navigate("/prestador", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    async function loadSpecialties() {
      try {
        const data = await apiRequest<{ specialties: Specialty[] }>("/api/specialties");
        setSpecialties(data.specialties);
        setSpecialtySlug(data.specialties[0]?.slug ?? "");
      } catch {
        setSpecialties([]);
      }
    }

    loadSpecialties();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest<ProviderAuthResponse>(
        mode === "login" ? "/api/providers/login" : "/api/providers/register",
        {
          method: "POST",
          body:
            mode === "login"
              ? { email, password }
              : { name, email, phone, companyName, specialtySlug, city, password }
        }
      );

      localStorage.setItem("itrampo:providerToken", response.token);
      localStorage.setItem("itrampo:provider", JSON.stringify(response.provider));
      setIsError(false);
      navigate("/prestador");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Erro ao entrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <Shell>
        <Header>
          <IconLink to="/login" aria-label="Voltar">
            <FaArrowLeft />
          </IconLink>
          <Logo src={logo} alt="Itrampo" />
          <Spacer />
        </Header>

        <Eyebrow>
          <FaTools />
          Area do prestador
        </Eyebrow>
        <Title>{mode === "login" ? "Entrar como prestador" : "Cadastrar prestador"}</Title>
        <Subtitle>
          {mode === "login"
            ? "Acesse sua area para acompanhar pedidos e oportunidades."
            : "Cadastre sua empresa para receber solicitacoes de servico."}
        </Subtitle>

        <Panel onSubmit={handleSubmit}>
          <Segmented>
            <SegmentButton
              active={mode === "login"}
              type="button"
              onClick={() => setMode("login")}
            >
              Entrar
            </SegmentButton>
            <SegmentButton
              active={mode === "register"}
              type="button"
              onClick={() => setMode("register")}
            >
              Cadastrar
            </SegmentButton>
          </Segmented>

          {mode === "register" && (
            <>
              <Field>
                Nome do responsavel
                <Input value={name} onChange={(event) => setName(event.target.value)} required />
              </Field>

              <Field>
                Empresa
                <Input
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  required
                />
              </Field>

              <Field>
                Telefone
                <Input value={phone} onChange={(event) => setPhone(event.target.value)} required />
              </Field>

              <Field>
                Especialidade
                <Select
                  value={specialtySlug}
                  onChange={(event) => setSpecialtySlug(event.target.value)}
                  required
                >
                  {specialties.map((specialty) => (
                    <option key={specialty._id} value={specialty.slug}>
                      {specialty.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                Cidade
                <Input value={city} onChange={(event) => setCity(event.target.value)} />
              </Field>
            </>
          )}

          <Field>
            E-mail
            <Input
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>

          <Field>
            Senha
            <PasswordField>
              <Input
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
              />
              <PasswordButton
                type="button"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordButton>
            </PasswordField>
          </Field>

          <SubmitButton disabled={isSubmitting}>
            {isSubmitting
              ? "Enviando..."
              : mode === "login"
                ? "Entrar"
                : "Cadastrar prestador"}
          </SubmitButton>

          {message && <Message error={isError}>{message}</Message>}
        </Panel>

        <CustomerLink to="/login">
          <FaBriefcase />
          &nbsp; Entrar como usuario
        </CustomerLink>
      </Shell>
    </Page>
  );
};

export default ProviderLogin;
