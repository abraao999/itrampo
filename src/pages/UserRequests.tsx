import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaClock, FaTimes } from "react-icons/fa";
import logo from "../assets/Logo.png";
import { apiRequest } from "../lib/api";

type Appointment = {
  _id: string;
  service: string;
  company: string;
  providerName: string;
  providerPhone: string;
  customerName?: string;
  date: string;
  time: string;
  quotePrice?: number;
  proposedDate?: string;
  proposedTime?: string;
  quoteMessage?: string;
  status: "pending" | "quoted" | "accepted" | "declined" | "completed";
};

type User = {
  name?: string;
  email?: string;
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
`;

const Spacer = styled.div`
  width: 42px;
`;

const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 28px;
`;

const Subtitle = styled.p`
  margin: 0 0 20px;
  color: #667085;
`;

const Metric = styled.section`
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e6e9f2;
  padding: 16px;
  margin-bottom: 14px;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
`;

const MetricValue = styled.strong`
  display: block;
  color: #1d4ed8;
  font-size: 30px;
`;

const List = styled.div`
  display: grid;
  gap: 12px;
`;

const Card = styled.article`
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e6e9f2;
  padding: 16px;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const Badge = styled.span`
  border-radius: 999px;
  padding: 5px 9px;
  background: #eef4ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 800;
`;

const Detail = styled.p`
  margin: 7px 0;
  color: #344054;
  font-size: 14px;
`;

const QuoteBox = styled.div`
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e6e9f2;
  padding: 12px;
  margin-top: 12px;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button<{ danger?: boolean }>`
  border: 0;
  border-radius: 8px;
  padding: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: ${(props) => (props.danger ? "#fee2e2" : "#dcfce7")};
  color: ${(props) => (props.danger ? "#b42318" : "#067647")};
  font-weight: 800;
`;

const EmptyState = styled.p`
  color: #667085;
  font-weight: 700;
`;

const UserRequests: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useMemo(() => {
    const storedUser = localStorage.getItem("itrampo:user");
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  }, []);

  useEffect(() => {
    async function loadAppointments() {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiRequest<{ appointments: Appointment[] }>(
          `/api/appointments?customerEmail=${user.email}`
        );

        setAppointments(data.appointments);
      } catch {
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointments();
  }, [user?.email]);

  const updateStatus = async (
    appointmentId: string,
    status: "accepted" | "declined"
  ) => {
    try {
      const data = await apiRequest<{ appointment: Appointment }>(
        `/api/appointments/${appointmentId}`,
        {
          method: "PATCH",
          body: { status }
        }
      );

      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === appointmentId ? data.appointment : appointment
        )
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Nao foi possivel responder.");
    }
  };

  return (
    <Page>
      <Shell>
        <Header>
          <BackLink to="/" aria-label="Voltar">
            <FaArrowLeft />
          </BackLink>
          <Logo src={logo} alt="Itrampo" />
          <Spacer />
        </Header>

        <Title>Minhas solicitacoes</Title>
        <Subtitle>Acompanhe os orcamentos enviados pelos prestadores.</Subtitle>

        <Metric>
          <MetricValue>{appointments.length}</MetricValue>
          solicitacoes feitas
        </Metric>

        {isLoading && <EmptyState>Carregando solicitacoes...</EmptyState>}
        {!isLoading && appointments.length === 0 && (
          <EmptyState>Voce ainda nao fez nenhuma solicitacao.</EmptyState>
        )}

        <List>
          {appointments.map((appointment) => (
            <Card key={appointment._id}>
              <CardTop>
                <CardTitle>{appointment.service}</CardTitle>
                <Badge>{appointment.status}</Badge>
              </CardTop>
              <Detail>
                <strong>Prestador:</strong> {appointment.company}
              </Detail>
              <Detail>
                <strong>Responsavel:</strong> {appointment.providerName}
              </Detail>
              <Detail>
                <FaClock /> Solicitado para {appointment.date} as {appointment.time}
              </Detail>

              {appointment.status === "pending" && (
                <EmptyState>Aguardando o prestador enviar o orcamento.</EmptyState>
              )}

              {appointment.quotePrice && (
                <QuoteBox>
                  <Detail>
                    <strong>Valor:</strong> R$ {appointment.quotePrice.toFixed(2)}
                  </Detail>
                  <Detail>
                    <strong>Quando pode ser feito:</strong>{" "}
                    {appointment.proposedDate} as {appointment.proposedTime}
                  </Detail>
                  {appointment.quoteMessage && (
                    <Detail>
                      <strong>Mensagem:</strong> {appointment.quoteMessage}
                    </Detail>
                  )}

                  {appointment.status === "quoted" && (
                    <ActionGrid>
                      <ActionButton onClick={() => updateStatus(appointment._id, "accepted")}>
                        <FaCheck />
                        Aceitar
                      </ActionButton>
                      <ActionButton
                        danger
                        onClick={() => updateStatus(appointment._id, "declined")}
                      >
                        <FaTimes />
                        Recusar
                      </ActionButton>
                    </ActionGrid>
                  )}
                </QuoteBox>
              )}
            </Card>
          ))}
        </List>
      </Shell>
    </Page>
  );
};

export default UserRequests;
