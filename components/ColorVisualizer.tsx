"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { buildingColors, type BuildingColor } from "@/lib/building-colors";

const colorByName = new Map(buildingColors.map((color) => [color.name, color]));

const popularCombinations = [
  { name: "Evergreen & Clay", roof: "Evergreen", trim: "Evergreen", wall: "Clay" },
  { name: "Evergreen & White", roof: "Evergreen", trim: "Evergreen", wall: "White" },
  { name: "Black & White", roof: "Black", trim: "Black", wall: "White" },
  { name: "Black & Gray", roof: "Black", trim: "Black", wall: "Pewter Gray" },
  { name: "Red & White", roof: "Patriot Red", trim: "Patriot Red", wall: "White" },
  { name: "Red & Rawhide", roof: "Barn Red", trim: "Barn Red", wall: "Rawhide" },
  { name: "Gray & White", roof: "Quaker Gray", trim: "White", wall: "Pewter Gray" },
  { name: "Brown & Beige", roof: "Earth Brown", trim: "Earth Brown", wall: "Pebble Beige" },
];

function Swatches({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: BuildingColor;
  onSelect: (color: BuildingColor) => void;
}) {
  return (
    <fieldset className="visualizer-fieldset">
      <legend>{label}</legend>
      <p>Selected: <strong>{selected.name}</strong></p>
      <div className="visualizer-swatches">
        {buildingColors.map((color) => (
          <button
            type="button"
            key={color.name}
            className={selected.name === color.name ? "is-selected" : ""}
            aria-label={`${label}: ${color.name}`}
            aria-pressed={selected.name === color.name}
            title={color.name}
            onClick={() => onSelect(color)}
          >
            <span style={{ backgroundColor: color.hex }} />
            <small>{color.name}</small>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function ColorVisualizer() {
  const [roof, setRoof] = useState(colorByName.get("Evergreen")!);
  const [trim, setTrim] = useState(colorByName.get("Evergreen")!);
  const [wall, setWall] = useState(colorByName.get("Clay")!);

  const layerPath = (part: "roof" | "trim" | "wall", color: BuildingColor) =>
    `/eagle-color-picker/${part}/${String(color.index).padStart(3, "0")}.png`;

  const applyCombination = (combination: (typeof popularCombinations)[number]) => {
    setRoof(colorByName.get(combination.roof)!);
    setTrim(colorByName.get(combination.trim)!);
    setWall(colorByName.get(combination.wall)!);
  };

  return (
    <section className="color-visualizer" id="color-visualizer">
      <div className="visualizer-intro">
        <p className="eyebrow"><span />Interactive color visualizer</p>
        <h2>Click a color. See your building change.</h2>
        <p>Choose roof, trim, and wall colors separately, or start with one of the popular combinations below.</p>
      </div>

      <div className="visualizer-shell">
        <div className="visualizer-stage">
          <div className="visualizer-scene" aria-label={`Sample building with ${roof.name} roof, ${trim.name} trim, and ${wall.name} walls`}>
            <Image
              className="visualizer-photo"
              src="/eagle-color-picker/base.webp"
              alt="Metal garage color preview"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
            />
            <Image className="visualizer-photo visualizer-layer" src={layerPath("roof", roof)} alt="" fill sizes="(max-width: 900px) 100vw, 58vw" />
            <Image className="visualizer-photo visualizer-layer" src={layerPath("trim", trim)} alt="" fill sizes="(max-width: 900px) 100vw, 58vw" />
            <Image className="visualizer-photo visualizer-layer" src={layerPath("wall", wall)} alt="" fill sizes="(max-width: 900px) 100vw, 58vw" />
          </div>
          <div className="visualizer-selection-summary" aria-live="polite">
            <div><span style={{ backgroundColor: roof.hex }} /><small>Roof</small><strong>{roof.name}</strong></div>
            <div><span style={{ backgroundColor: trim.hex }} /><small>Trim</small><strong>{trim.name}</strong></div>
            <div><span style={{ backgroundColor: wall.hex }} /><small>Walls</small><strong>{wall.name}</strong></div>
          </div>
          <Link
            className="button visualizer-quote-button"
            href={`/?structure=Garage&roofColor=${encodeURIComponent(roof.name)}&trimColor=${encodeURIComponent(trim.name)}&wallColor=${encodeURIComponent(wall.name)}#quote`}
          >
            Quote these colors <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="visualizer-controls">
          <Swatches label="Roof color" selected={roof} onSelect={setRoof} />
          <Swatches label="Trim color" selected={trim} onSelect={setTrim} />
          <Swatches label="Wall color" selected={wall} onSelect={setWall} />
        </div>
      </div>

      <div className="popular-color-combos">
        <h3>Popular combinations</h3>
        <div>
          {popularCombinations.map((combination) => {
            const primary = colorByName.get(combination.roof)!;
            const secondary = colorByName.get(combination.wall)!;
            return (
              <button type="button" key={combination.name} onClick={() => applyCombination(combination)}>
                <span className="popular-combo-preview" aria-hidden="true">
                  <i style={{ backgroundColor: primary.hex }} />
                  <i style={{ backgroundColor: secondary.hex }} />
                </span>
                <strong>{combination.name}</strong>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
