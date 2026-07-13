"use client";

import React, { useRef, useEffect } from "react";

/**
 * AuroraGL - Dark smoke / electric plasma effect.
 * Sinuous slow-moving greyscale wisps over pure black.
 * Used in footer, hero, and product section as an atmospheric depth layer.
 * Outputs brightness as alpha so it composites cleanly under the lightning layer.
 */
export default function FooterGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    const vertexSrc = `
      attribute vec2 aPosition;
      void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
    `;

    const fragmentSrc = `
      precision highp float;
      uniform vec2  uResolution;
      uniform float uTime;

      float hash(vec2 p) {
        p = fract(p * vec2(127.1, 311.7));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 6; i++) {
          v += a * smoothNoise(p);
          p  = rot * p * 2.1;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        vec2 st = uv * vec2(uResolution.x / uResolution.y, 1.0);
        float t = uTime * 0.09;

        vec2 q = vec2(
          fbm(st + vec2(0.0, 0.0) + t),
          fbm(st + vec2(5.2, 1.3) + t * 0.7)
        );

        vec2 r = vec2(
          fbm(st + 4.0 * q + vec2(1.7, 9.2) + t * 0.3),
          fbm(st + 4.0 * q + vec2(8.3, 2.8) + t * 0.2)
        );

        float n = fbm(st + 4.0 * r + t * 0.15);

        vec3 col = vec3(0.0);
        col = mix(col, vec3(0.02),        smoothstep(0.0,  0.45, n));
        col = mix(col, vec3(0.07),        smoothstep(0.30, 0.60, n));
        col = mix(col, vec3(0.14),        smoothstep(0.50, 0.72, n));
        col = mix(col, vec3(0.28),        smoothstep(0.65, 0.82, n));
        col = mix(col, vec3(0.55, 0.55, 0.58), smoothstep(0.78, 0.92, n));

        vec2 vig = uv * (1.0 - uv.yx);
        float vignette = pow(vig.x * vig.y * 15.0, 0.35);
        col *= vignette;

        float pulse = 1.0 + 0.04 * sin(uTime * 0.4);
        col *= pulse;

        float lum = dot(col, vec3(0.299, 0.587, 0.114));
        float alpha = clamp(lum * 3.5, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    const compile = (src: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("FooterGL shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(vertexSrc, gl.VERTEX_SHADER);
    const fs = compile(fragmentSrc, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("FooterGL link:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const verts = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");

    const start = performance.now();
    let rafId: number;

    const render = () => {
      resizeCanvas();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block", pointerEvents: "none" }}
    />
  );
}
