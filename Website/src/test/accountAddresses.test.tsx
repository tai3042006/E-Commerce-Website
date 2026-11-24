import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import AccountAddresses from "@/pages/AccountAddresses";

vi.mock("@/components/clofit/Layout", () => ({ Layout: ({ children }: { children: React.ReactNode }) => children }));

afterEach(() => vi.unstubAllGlobals());

it("renders saved addresses and opens the add and edit dialogs", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [
    { id: "one", full_name: "Minh", address_line: "12 Le Loi", city: "Hue", phone: "0123", is_default: true },
  ] }));
  render(<MemoryRouter><AccountAddresses /></MemoryRouter>);
  await screen.findByText("Minh");
  fireEvent.click(screen.getByRole("button", { name: "Add New Address" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  fireEvent.click(screen.getByRole("button", { name: "Edit address" }));
  expect(screen.getByDisplayValue("12 Le Loi")).toBeInTheDocument();
});
