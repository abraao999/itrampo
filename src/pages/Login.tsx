import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBriefcase, FaEye, FaEyeSlash } from "react-icons/fa";
import { apiRequest } from "../lib/api";
import logo from "../assets/Logo.png";

type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
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
  width: min(100%, 420px);
  padding: 28px 20px 36px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const BackLink = styled(Link)`
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

const TitleBlock = styled.section`
  margin-bottom: 24px;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f06d2f;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  color: #172033;
  font-size: 30px;
  line-height: 1.15;
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  margin: 0;
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
  font-weight: 700;
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

  &:focus {
    border-color: #1d4ed8;
    outline: 3px solid rgba(29, 78, 216, 0.13);
  }
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Message = styled.p<{ error?: boolean }>`
  margin: 14px 0 0;
  color: ${(props) => (props.error ? "#b42318" : "#067647")};
  font-size: 14px;
  font-weight: 700;
`;

// const ProviderLink = styled(Link)`
//   display: inline-flex;
//   align-items: center;
//   gap: 8px;
//   margin-top: 16px;
//   color: #1d4ed8;
//   font-weight: 800;
//   text-decoration: none;
// `;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("itrampo:token");

    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest<AuthResponse>(
        mode === "login" ? "/api/auth/login" : "/api/auth/register",
        {
          method: "POST",
          body:
            mode === "login"
              ? { email, password }
              : { name, email, phone, password },
        },
      );

      localStorage.setItem("itrampo:token", response.token);
      localStorage.setItem("itrampo:user", JSON.stringify(response.user));
      setIsError(false);
      setMessage(mode === "login" ? "Login realizado." : "Conta criada.");
      navigate("/");
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
          <BackLink to="/" aria-label="Voltar para inicio">
            <FaArrowLeft />
          </BackLink>
          <Logo src={logo} alt="Itrampo" />
          <Spacer />
        </Header>

        <TitleBlock>
          <Eyebrow>
            <FaBriefcase />
            Area do usuario
          </Eyebrow>
          <Title>
            {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
          </Title>
          <Subtitle>
            {mode === "login"
              ? "Acesse seus pedidos, orcamentos e agendamentos."
              : "Cadastre-se para solicitar servicos pelo Itrampo."}
          </Subtitle>
        </TitleBlock>

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
              Criar conta
            </SegmentButton>
          </Segmented>

          {mode === "register" && (
            <>
              <Field>
                Nome
                <Input
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </Field>

              <Field>
                Telefone
                <Input
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="(00) 00000-0000"
                />
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
              placeholder="voce@email.com"
              required
            />
          </Field>

          <Field>
            Senha
            <PasswordField>
              <Input
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimo 6 caracteres"
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
                : "Criar conta"}
          </SubmitButton>

          {message && <Message error={isError}>{message}</Message>}
        </Panel>

        {/* <ProviderLink to="/prestador/login">
          <FaBriefcase />
          Entrar como prestador
        </ProviderLink> */}
      </Shell>
    </Page>
  );
};

export default Login;
