"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import { MENU_SIZE_LABELS } from "@/components/menu/menu-data";
import {
  clearPendingOrder,
  getPendingOrderServerSnapshot,
  readPendingOrder,
  subscribeToPendingOrder,
} from "@/lib/orders";

const steps = ["Datos", "Tarjeta", "Revisión"];

type CheckoutForm = {
  fullName: string;
  phone: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const initialForm: CheckoutForm = {
  fullName: "",
  phone: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
});

const formatCurrency = (value: number): string => currency.format(value);

export function Checkout(): ReactNode {
  const router = useRouter();
  const pendingOrder = useSyncExternalStore(
    subscribeToPendingOrder,
    readPendingOrder,
    getPendingOrderServerSnapshot
  );
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutForm, string>>
  >({});
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paidOrderId, setPaidOrderId] = useState("");

  const updateField =
    (field: keyof CheckoutForm) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };

  const validateStep = (): boolean => {
    const nextErrors: Partial<Record<keyof CheckoutForm, string>> = {};

    if (activeStep === 0) {
      if (!form.fullName.trim()) nextErrors.fullName = "Escribe tu nombre.";
      if (!form.phone.trim()) nextErrors.phone = "Escribe tu teléfono.";
    }

    if (activeStep === 1) {
      const cardDigits = form.cardNumber.replace(/\D/g, "");
      if (!form.cardName.trim()) nextErrors.cardName = "Escribe el nombre.";
      if (cardDigits.length < 13) nextErrors.cardNumber = "Tarjeta inválida.";
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
        nextErrors.expiry = "Usa MM/AA.";
      }
      if (!/^\d{3,4}$/.test(form.cvc)) nextErrors.cvc = "CVC inválido.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = (): void => {
    if (!validateStep()) return;
    setActiveStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = (): void => {
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const submitPayment = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!pendingOrder || paymentStatus === "processing") return;

    setPaymentStatus("processing");
    setPaymentMessage("");

    fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: pendingOrder.orderId,
        amount: pendingOrder.total,
        cardLast4: form.cardNumber.replace(/\D/g, "").slice(-4),
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("No se pudo procesar el pago.");

        const data = (await response.json()) as { paymentId: string };
        setPaymentStatus("success");
        setPaidOrderId(pendingOrder.orderId);
        setPaymentMessage(`Pago aprobado: ${data.paymentId}`);
        clearPendingOrder();
      })
      .catch(() => {
        setPaymentStatus("error");
        setPaymentMessage("No se pudo procesar el pago. Revisa la tarjeta.");
      });
  };

  if (paymentStatus === "success" && paidOrderId) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center px-6 py-28">
        <Paper elevation={0} sx={{ maxWidth: 520, p: 4, borderRadius: 4 }}>
          <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
            <Chip label="Pago exitoso" color="success" />
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontFamily: "var(--font-serif)" }}
            >
              {paidOrderId} pagado
            </Typography>
            <Alert severity="success">{paymentMessage}</Alert>
            <Typography color="text.secondary">
              El pedido pendiente se limpió de este navegador. Ya puedes hacer
              otro pedido.
            </Typography>
            <Button variant="contained" onClick={() => router.push("/")}>
              Ir a inicio
            </Button>
          </Stack>
        </Paper>
      </main>
    );
  }

  if (!pendingOrder) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center px-6 py-28">
        <Paper elevation={0} sx={{ maxWidth: 520, p: 4, borderRadius: 4 }}>
          <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
            <Chip label="Checkout" />
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontFamily: "var(--font-serif)" }}
            >
              No hay pedido pendiente
            </Typography>
            <Typography color="text.secondary">
              Cuando confirmes un pedido desde el menú, aparecerá aquí para
              pagarlo antes de crear otro.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/projects")}
            >
              Ir al menú
            </Button>
          </Stack>
        </Paper>
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] px-6 py-28 sm:px-10">
      <Box sx={{ mx: "auto", width: "100%", maxWidth: 1120 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Checkout
            </Typography>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontFamily: "var(--font-serif)", lineHeight: 0.95 }}
            >
              Pagar {pendingOrder.orderId}
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={submitPayment}
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { md: "1fr 360px" },
            }}
          >
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
              <Stack spacing={4}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((step) => (
                    <Step key={step}>
                      <StepLabel>{step}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {activeStep === 0 ? (
                  <Stack spacing={2}>
                    <Typography variant="h6">Datos del cliente</Typography>
                    <TextField
                      label="Nombre completo"
                      value={form.fullName}
                      onChange={updateField("fullName")}
                      error={Boolean(errors.fullName)}
                      helperText={errors.fullName}
                      fullWidth
                    />
                    <TextField
                      label="Teléfono"
                      value={form.phone}
                      onChange={updateField("phone")}
                      error={Boolean(errors.phone)}
                      helperText={errors.phone}
                      type="number"
                      fullWidth
                    />
                  </Stack>
                ) : null}

                {activeStep === 1 ? (
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "center" }}
                    >
                      <CreditCard size={20} />
                      <Typography variant="h6">Datos de tarjeta</Typography>
                    </Stack>
                    <TextField
                      label="Nombre en la tarjeta"
                      value={form.cardName}
                      onChange={updateField("cardName")}
                      error={Boolean(errors.cardName)}
                      helperText={errors.cardName}
                      fullWidth
                    />
                    <TextField
                      label="Número de tarjeta"
                      value={form.cardNumber}
                      onChange={updateField("cardNumber")}
                      error={Boolean(errors.cardNumber)}
                      helperText={
                        errors.cardNumber ??
                        "Digitos: " + form.cardNumber.length
                      }
                      slotProps={{ htmlInput: { inputMode: "numeric" } }}
                      type="number"
                      fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        label="Expira"
                        placeholder="MM/AA"
                        value={form.expiry}
                        onChange={updateField("expiry")}
                        error={Boolean(errors.expiry)}
                        helperText={errors.expiry}
                        fullWidth
                      />
                      <TextField
                        label="CVV"
                        value={form.cvc}
                        onChange={updateField("cvc")}
                        error={Boolean(errors.cvc)}
                        helperText={errors.cvc}
                        slotProps={{ htmlInput: { inputMode: "numeric" } }}
                        fullWidth
                      />
                    </Stack>
                  </Stack>
                ) : null}

                {activeStep === 2 ? (
                  <Stack spacing={2}>
                    <Typography variant="h6">Revisa tu orden</Typography>
                    {pendingOrder.items.map((item) => (
                      <Stack
                        key={`${item.product}-${item.size}`}
                        direction="row"
                        spacing={2}
                        sx={{ justifyContent: "space-between" }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {item.quantity}x {item.product}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {MENU_SIZE_LABELS[item.size]} ·{" "}
                            {formatCurrency(item.unitPrice)} c/u
                          </Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatCurrency(item.subtotal)}
                        </Typography>
                      </Stack>
                    ))}
                    <Divider />
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography>Total</Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontFamily: "var(--font-serif)" }}
                      >
                        {formatCurrency(pendingOrder.total)}
                      </Typography>
                    </Stack>
                  </Stack>
                ) : null}

                {paymentMessage ? (
                  <Alert
                    severity={paymentStatus === "error" ? "error" : "success"}
                  >
                    {paymentMessage}
                  </Alert>
                ) : null}

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Button
                    disabled={
                      activeStep === 0 || paymentStatus === "processing"
                    }
                    onClick={goBack}
                  >
                    Atrás
                  </Button>
                  {activeStep < steps.length - 1 ? (
                    <Button variant="contained" onClick={goNext}>
                      Siguiente
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={paymentStatus === "processing"}
                      startIcon={
                        paymentStatus === "processing" ? (
                          <CircularProgress color="inherit" size={16} />
                        ) : undefined
                      }
                    >
                      {paymentStatus === "processing"
                        ? "Procesando"
                        : "Pagar cuenta"}
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Paper>

            <Card
              variant="outlined"
              sx={{ alignSelf: "start", borderRadius: 4 }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Chip
                    label="Pedido actual"
                    color="primary"
                    sx={{ width: "fit-content" }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: "var(--font-serif)" }}
                  >
                    {pendingOrder.orderId}
                  </Typography>
                  <Divider />
                  <Stack spacing={1.5}>
                    {pendingOrder.items.map((item) => (
                      <Stack
                        key={`${item.product}-${item.size}-summary`}
                        direction="row"
                        spacing={2}
                        sx={{ justifyContent: "space-between" }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity}x {item.product}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {formatCurrency(item.subtotal)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Divider />
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontFamily: "var(--font-serif)" }}
                    >
                      {formatCurrency(pendingOrder.total)}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Box>
    </main>
  );
}
