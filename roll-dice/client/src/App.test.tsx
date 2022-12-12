import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

const server = setupServer(
  rest.post("http://localhost:4000/roll-dice", (_, res, ctx) => {
    return res(ctx.json([1, 2, 3, 4, 5, 6]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders h1 tag", () => {
  render(<App />);
  const linkElement = screen.getByText(/Roll Dice App/i);
  expect(linkElement).toBeInTheDocument();
});

test("set initial value in input for the number of dice", () => {
  render(<App />);
  const numberInput = screen.getByDisplayValue(3);
  expect(numberInput).toBeInTheDocument();
});

test("set initial value in selector for size of dice", () => {
  render(<App />);
  const selectSizeSelector = screen.getByDisplayValue("Medium");
  expect(selectSizeSelector).toBeInTheDocument();
});

test("able to change the number of dice", () => {
  render(<App />);
  const items1 = screen.getAllByAltText("dice");
  expect(items1).toHaveLength(3);
  const input = screen.getByLabelText("countDice");
  if (input) fireEvent.change(input, { target: { value: 5 } });
  const items2 = screen.getAllByAltText("dice");
  expect(items2).toHaveLength(5);
});

test("able to change the size of dice", () => {
  render(<App />);
  const items1 = screen.getAllByAltText("dice")[0];
  expect(items1).toHaveStyle({ width: "50px" });
  const select = screen.getByTestId("select-sizeDice");
  if (select) fireEvent.change(select, { target: { value: "large" } });
  const items2 = screen.getAllByAltText("dice")[0];
  expect(items2).toHaveStyle({ width: "75px" });
  if (select) fireEvent.change(select, { target: { value: "small" } });
  const items3 = screen.getAllByAltText("dice")[0];
  expect(items3).toHaveStyle({ width: "25px" });
});

test("set random values in the form when clicking the button", () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /button-random/i });
  const items1: any = screen.getByLabelText("countDice");
  const items2: any = screen.getByTestId("select-sizeDice");
  const countDice: Set<number> = new Set();
  const countSize: Set<string> = new Set();
  for (let i = 0; i < 10; i++) {
    if (button) fireEvent.click(button);
    if (items1) countDice.add(items1.value);
    if (items2) countSize.add(items2.value);
  }
  expect(countDice.size).not.toBe(1);
  expect(countSize.size).not.toBe(1);
});

test("roll dice", async () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /button-roll/i });
  if (button) fireEvent.click(button);
  await waitFor(() => expect(screen.getByRole("row")).toHaveTextContent(/^Total21$/));
  // expect(await screen.findByText("21")).toBeInTheDocument();
});
