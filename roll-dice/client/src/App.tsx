import React, { useEffect, useState } from "react";
import "./App.css";
import getRandom from "./utils";

enum EnumSize {
  "small",
  "medium",
  "large",
}

type TInput = {
  count: number;
  size: EnumSize;
};

const App = () => {
  const [dice, setDice] = useState<number[]>([]);
  const [input, setInput] = useState<TInput>({ count: 3, size: EnumSize.medium });

  const randomSetting = () => {
    setInput({
      count: getRandom(1, 10),
      size: getRandom(0, 2),
    });
  };
  const rollDice = () => {
    const urls: { [key: string]: string } = {
      node: "http://localhost:4000/roll-dice",
      django: "http://localhost:8000/api/roll-dice",
    };
    fetch(urls.django, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ count: input.count }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => setDice(data));
  };

  useEffect(() => {
    setDice(Array(input.count).fill(1));
  }, [input.count]);

  return (
    <div id='app'>
      <header>
        <h1>Roll Dice App</h1>
      </header>
      <main>
        <section>
          <form>
            <div>
              <label htmlFor='countDice'>How many dices?</label>
              <input
                name='countDice'
                aria-label='countDice'
                type='number'
                value={input.count}
                onChange={(e) => {
                  setInput((prev) => ({ ...prev, count: Number(e.target.value) || 0 }));
                }}
              />
            </div>
            <div>
              <label htmlFor='sizeDice'>What size of dices?</label>
              <select
                data-testid='select-sizeDice'
                name='sizeDice'
                value={EnumSize[input.size]}
                onChange={(e) => {
                  setInput((prev) => ({ ...prev, size: EnumSize[e.target.value as keyof typeof EnumSize] }));
                }}
              >
                <option value='small'>Small</option>
                <option value='medium'>Medium</option>
                <option value='large'>Large</option>
              </select>
            </div>
          </form>
          <div id='buttons-container'>
            <button aria-label='button-random' onClick={randomSetting}>
              Random Settings
            </button>
            <button aria-label='button-roll' onClick={rollDice}>
              Roll Dice
            </button>
          </div>
        </section>
        <section id='dice-container'>
          {dice.map((die: number, i: number) => (
            <img key={i} className='dice-image' src={`dice/${die.toString()}.svg`} alt='dice' style={{ width: (input.size + 1) * 25 }} />
          ))}
        </section>
        <section>
          <table id='statistic-table'>
            <tbody>
              <tr>
                <td>Total</td>
                <td>{dice.length > 0 && dice.reduce((a, b) => a + b)}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default App;
