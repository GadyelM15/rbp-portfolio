"use client";

import { useId } from "react";
import type { CSSProperties, ReactNode } from "react";

export type ReflectiveCardProps = {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  price?: string;
  blurStrength?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  overlayColor?: string;
  displacementStrength?: number;
  noiseScale?: number;
  specularConstant?: number;
  grayscale?: number;
  glassDistortion?: number;
  className?: string;
  style?: CSSProperties;
};

export function ReflectiveCard({
  image,
  imageAlt = "",
  eyebrow,
  title,
  subtitle,
  price,
  blurStrength = 2,
  color = "white",
  metalness = 1,
  roughness = 0.4,
  overlayColor = "rgba(0, 0, 0, 0.25)",
  displacementStrength = 12,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 0,
  glassDistortion = 0,
  className = "",
  style = {},
}: ReflectiveCardProps): ReactNode {
  const filterId = `metallic-displacement-${useId().replace(/:/g, "")}`;
  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    "--blur-strength": `${blurStrength}px`,
    "--metalness": metalness,
    "--roughness": roughness,
    "--overlay-color": overlayColor,
    "--text-color": color,
    "--saturation": saturation,
  } as CSSProperties;

  return (
    <div
      className={`relative isolate h-[440px] w-full overflow-hidden rounded-[20px] bg-[#1a1a1a] font-sans shadow-[0_20px_50px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.1)_inset] ${className}`}
      style={{ ...style, ...cssVariables }}
    >
      <svg
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="turbulence"
              baseFrequency={baseFrequency}
              numOctaves="2"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="luminanceToAlpha"
              result="noiseAlpha"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale={displacementStrength}
              specularConstant={specularConstant}
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite
              in="light"
              in2="rippled"
              operator="in"
              result="light-effect"
            />
            <feBlend
              in="light-effect"
              in2="rippled"
              mode="screen"
              result="metallic-result"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="solidAlpha"
            />
            <feMorphology
              in="solidAlpha"
              operator="erode"
              radius="45"
              result="erodedAlpha"
            />
            <feGaussianBlur
              in="erodedAlpha"
              stdDeviation="10"
              result="blurredMap"
            />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap
              in="metallic-result"
              in2="glassMap"
              scale={glassDistortion}
              xChannelSelector="A"
              yChannelSelector="A"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={imageAlt}
        className="absolute top-0 left-0 z-0 h-full w-full scale-[1.2] object-cover opacity-90 transition-[filter] duration-300"
        style={{
          filter: `saturate(var(--saturation, 0)) contrast(115%) brightness(95%) blur(var(--blur-strength, 2px)) url(#${filterId})`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noiseFilter%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.8%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url(%23noiseFilter)%27%2F%3E%3C%2Fsvg%3E')] opacity-[var(--roughness,0.4)] mix-blend-overlay" />

      <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.1)_40%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.1)_60%,rgba(255,255,255,0.3)_100%)] opacity-[var(--metalness,1)] mix-blend-overlay" />

      <div className="pointer-events-none absolute inset-0 z-20 rounded-[20px] bg-[linear-gradient(135deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.6)_100%)] p-[1px] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]" />

      <div className="relative z-10 flex h-full flex-col justify-between bg-[var(--overlay-color)] p-8 text-[var(--text-color)]">
        {eyebrow ? (
          <span className="w-fit rounded border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-bold tracking-[0.1em] uppercase">
            {eyebrow}
          </span>
        ) : (
          <span />
        )}

        <div className="flex flex-col gap-2">
          <h3 className="m-0 text-2xl font-bold tracking-[0.02em] drop-shadow-md">
            {title}
          </h3>
          {subtitle ? (
            <p className="m-0 text-sm leading-[1.4] opacity-80">{subtitle}</p>
          ) : null}
          {price ? (
            <span className="mt-2 font-mono text-lg tracking-[0.05em]">
              {price}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ReflectiveCard;
