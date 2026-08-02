import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DevLogin from "../pages/DevLogin";
import * as superAdminService from "../services/superAdminService";

vi.mock("../services/superAdminService", async () => {
  const actual = await vi.importActual("../services/superAdminService");
  return {
    ...actual,
    loginDev: vi.fn().mockResolvedValue({ success: true, role: "superadmin" }),
  };
});

describe("DevLogin Component", () => {
  it("renders developer login form", () => {
    render(<DevLogin onLogin={() => {}} />);
    expect(screen.getByText("Portal de Desarrollador")).toBeInTheDocument();
    expect(screen.getByText("Acceso SuperAdmin / Dev")).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo de Desarrollador/i)).toBeInTheDocument();
  });

  it("calls onLogin when developer credentials are submitted", async () => {
    const handleLogin = vi.fn();
    render(<DevLogin onLogin={handleLogin} />);

    const emailInput = screen.getByLabelText(/Correo de Desarrollador/i);
    const submitBtn = screen.getByRole("button", { name: /Ingresar como Desarrollador/i });

    fireEvent.change(emailInput, { target: { value: "dev@bedtrack.dev" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith("superadmin");
    });
  });
});
