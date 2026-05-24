import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaClock, FaPhone, FaSignOutAlt, FaTools, FaUser } from "react-icons/fa";
import logo from "../assets/Logo.png";
import { apiRequest } from "../lib/api";

type Provider = {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  specialtyName: string;
  city?: string;
  status: string;
};

type Appointment = {
  _id: string;
  service: string;
  company: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  date: string;
  time: string;
  quotePrice?: number;
  proposedDate?: string;
  proposedTime?: string;
  quoteMessage?: string;
  status: "pending" | "quoted" | "accepted" | "declined" | "completed";
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

const AgendaList = styled.div`
  display: grid;
  gap: 12px;
`;

const AppointmentCard = styled.article`
  border: 1px solid #e6e9f2;
  border-radius: 8px;
  padding: 14px;
  background: #ffffff;
`;

const AppointmentTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
`;

const AppointmentTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const Badge = styled.span`
  border-radius: 999px;
  padding: 5px 9px;
  background: #fff7ed;
  color: #c2410c;
  font-size: 12px;
  font-weight: 800;
`;

const Detail = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 7px 0;
  color: #344054;
  font-size: 14px;
`;

const EmptyState = styled.p`
  margin: 0;
  color: #667085;
  font-weight: 700;
`;

const QuoteForm = styled.form`
  display: grid;
  gap: 9px;
  margin-top: 12px;
`;

const QuoteGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const QuoteInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
`;

const QuoteTextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  padding: 10px;
  min-height: 74px;
  font-family: inherit;
  font-size: 14px;
`;

const QuoteButton = styled.button`
  border: 0;
  border-radius: 8px;
  padding: 11px;
  background: #1d4ed8;
  color: #ffffff;
  font-weight: 800;
`;

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [quoteDrafts, setQuoteDrafts] = useState<
    Record<string, { quotePrice: string; proposedDate: string; proposedTime: string; quoteMessage: string }>
  >({});
  const provider = useMemo(() => {
    const storedProvider = localStorage.getItem("itrampo:provider");
    return storedProvider ? (JSON.parse(storedProvider) as Provider) : null;
  }, []);

  useEffect(() => {
    async function loadAppointments() {
      if (!provider?.id) {
        setIsLoadingAppointments(false);
        return;
      }

      try {
        const data = await apiRequest<{ appointments: Appointment[] }>(
          `/api/appointments?providerId=${provider.id}`
        );

        setAppointments(data.appointments);
      } catch {
        setAppointments([]);
      } finally {
        setIsLoadingAppointments(false);
      }
    }

    loadAppointments();
  }, [provider?.id]);

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  );
  const scheduledAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "pending" ||
      appointment.status === "quoted" ||
      appointment.status === "accepted"
  );

  const updateQuoteDraft = (
    appointmentId: string,
    field: "quotePrice" | "proposedDate" | "proposedTime" | "quoteMessage",
    value: string
  ) => {
    setQuoteDrafts((current) => ({
      ...current,
      [appointmentId]: {
        quotePrice: current[appointmentId]?.quotePrice ?? "",
        proposedDate: current[appointmentId]?.proposedDate ?? "",
        proposedTime: current[appointmentId]?.proposedTime ?? "",
        quoteMessage: current[appointmentId]?.quoteMessage ?? "",
        [field]: value
      }
    }));
  };

  const sendQuote = async (appointment: Appointment) => {
    const draft = quoteDrafts[appointment._id];

    if (!draft?.quotePrice || !draft.proposedDate || !draft.proposedTime) {
      alert("Informe valor, data e hora do orcamento.");
      return;
    }

    try {
      const data = await apiRequest<{ appointment: Appointment }>(
        `/api/appointments/${appointment._id}`,
        {
          method: "PATCH",
          body: {
            status: "quoted",
            quotePrice: Number(draft.quotePrice),
            proposedDate: draft.proposedDate,
            proposedTime: draft.proposedTime,
            quoteMessage: draft.quoteMessage
          }
        }
      );

      setAppointments((current) =>
        current.map((item) => (item._id === appointment._id ? data.appointment : item))
      );
      alert("Orcamento enviado para o cliente.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Nao foi possivel enviar o orcamento.");
    }
  };

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
              <MetricValue>{pendingAppointments.length}</MetricValue>
              <MetricLabel>Novas</MetricLabel>
            </Metric>
            <Metric>
              <MetricValue>{scheduledAppointments.length}</MetricValue>
              <MetricLabel>Agendadas</MetricLabel>
            </Metric>
          </MetricGrid>
        </Card>

        <Card>
          <CardTitle>
            <FaCalendarCheck />
            Agenda de atendimento
          </CardTitle>

          {isLoadingAppointments && <EmptyState>Carregando agenda...</EmptyState>}

          {!isLoadingAppointments && appointments.length === 0 && (
            <EmptyState>Nenhum atendimento agendado ainda.</EmptyState>
          )}

          <AgendaList>
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment._id}>
                <AppointmentTop>
                  <AppointmentTitle>{appointment.service}</AppointmentTitle>
                  <Badge>{appointment.status}</Badge>
                </AppointmentTop>
                <Detail>
                  <FaClock />
                  {appointment.date} as {appointment.time}
                </Detail>
                <Detail>
                  <FaUser />
                  {appointment.customerName || "Cliente"}
                </Detail>
                {appointment.customerPhone && (
                  <Detail>
                    <FaPhone />
                    {appointment.customerPhone}
                  </Detail>
                )}
                {appointment.quotePrice && (
                  <Detail>
                    Orcamento: R$ {appointment.quotePrice.toFixed(2)}
                  </Detail>
                )}
                {appointment.proposedDate && appointment.proposedTime && (
                  <Detail>
                    Fazer em {appointment.proposedDate} as {appointment.proposedTime}
                  </Detail>
                )}
                {appointment.status === "pending" && (
                  <QuoteForm
                    onSubmit={(event) => {
                      event.preventDefault();
                      sendQuote(appointment);
                    }}
                  >
                    <QuoteInput
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Valor do orcamento"
                      value={quoteDrafts[appointment._id]?.quotePrice ?? ""}
                      onChange={(event) =>
                        updateQuoteDraft(appointment._id, "quotePrice", event.target.value)
                      }
                    />
                    <QuoteGrid>
                      <QuoteInput
                        type="date"
                        value={quoteDrafts[appointment._id]?.proposedDate ?? ""}
                        onChange={(event) =>
                          updateQuoteDraft(appointment._id, "proposedDate", event.target.value)
                        }
                      />
                      <QuoteInput
                        type="time"
                        value={quoteDrafts[appointment._id]?.proposedTime ?? ""}
                        onChange={(event) =>
                          updateQuoteDraft(appointment._id, "proposedTime", event.target.value)
                        }
                      />
                    </QuoteGrid>
                    <QuoteTextArea
                      placeholder="Mensagem para o cliente"
                      value={quoteDrafts[appointment._id]?.quoteMessage ?? ""}
                      onChange={(event) =>
                        updateQuoteDraft(appointment._id, "quoteMessage", event.target.value)
                      }
                    />
                    <QuoteButton type="submit">Enviar orcamento</QuoteButton>
                  </QuoteForm>
                )}
              </AppointmentCard>
            ))}
          </AgendaList>
        </Card>
      </Shell>
    </Page>
  );
};

export default ProviderDashboard;
