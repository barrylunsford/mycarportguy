"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const divisors = { 24: 14.4, 36: 19.8, 48: 21.6, 60: 24 } as const;
type Term = keyof typeof divisors;

function dollars(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RentToOwnEstimator() {
  const [buildingCost, setBuildingCost] = useState(10000);
  const [term, setTerm] = useState<Term>(36);
  const monthlyPayment = useMemo(
    () => buildingCost / divisors[term],
    [buildingCost, term],
  );

  return (
    <section className="rto-estimator" id="payment-estimator" aria-labelledby="estimator-title">
      <div className="rto-estimator-intro">
        <p className="eyebrow"><span />Payment estimator</p>
        <h2 id="estimator-title">See an estimated building payment.</h2>
        <p>
          Adjust the building cost and term to get a quick planning estimate.
          We&apos;ll confirm the current payment, deposit, taxes, and any fees with
          your final quote.
        </p>
      </div>
      <div className="rto-calculator">
        <label htmlFor="building-cost">
          <span>Estimated building cost</span>
          <strong>{dollars(buildingCost)}</strong>
        </label>
        <input
          id="building-cost"
          type="range"
          min="3000"
          max="25000"
          step="250"
          value={buildingCost}
          onChange={(event) => setBuildingCost(Number(event.target.value))}
        />
        <div className="rto-range-labels"><span>$3,000</span><span>$25,000</span></div>

        <fieldset>
          <legend>Term length</legend>
          <div className="rto-term-options">
            {(Object.keys(divisors).map(Number) as Term[]).map((months) => (
              <button
                key={months}
                type="button"
                className={term === months ? "active" : ""}
                onClick={() => setTerm(months)}
              >
                {months} months
              </button>
            ))}
          </div>
        </fieldset>

        <div className="rto-result" aria-live="polite">
          <span>Estimated payment</span>
          <strong>{dollars(monthlyPayment)}<small>/month</small></strong>
          <p>Before taxes, deposit, loss-damage coverage, labor, and applicable fees.</p>
        </div>
        <Link className="button" href="/#quote">Get an exact quote <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
