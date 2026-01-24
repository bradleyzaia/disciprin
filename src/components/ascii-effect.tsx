"use client"

import { forwardRef, useMemo, useEffect } from "react"
import { Effect, BlendFunction } from "postprocessing"
import { Uniform, Vector2 } from "three"

const fragmentShader = `
// Basic uniforms
uniform float cellSize;
uniform bool invert;
uniform bool colorMode;
uniform int asciiStyle;

// Optimitzed: Removed unused PostFX uniforms (noise, glitch, scanlines, etc)
uniform vec2 resolution;
uniform vec2 mousePos;
uniform bool mouseGlowEnabled;
uniform float mouseGlowRadius;
uniform float mouseGlowIntensity;
uniform int colorPalette;
uniform float brightnessAdjust;
uniform float contrastAdjust;

// Helper functions
vec3 applyColorPalette(vec3 color, int palette) {
  if (palette == 1) { // Green
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(0.1, lum * 0.9, 0.1);
  } else if (palette == 2) { // Amber
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(lum * 1.0, lum * 0.6, lum * 0.2);
  } else if (palette == 3) { // Cyan
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(0.0, lum * 0.8, lum);
  } else if (palette == 4) { // Blue
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(0.1, 0.2, lum);
  }
  return color;
}

float getChar(float brightness, vec2 p, int style) {
  vec2 grid = floor(p * 4.0);
  float val = 0.0;
  if (style == 0) { // Standard
    if (brightness < 0.2) val = (grid.x == 1.0 && grid.y == 1.0) ? 0.3 : 0.0;
    else if (brightness < 0.35) val = (grid.x == 1.0 || grid.x == 2.0) && (grid.y == 1.0 || grid.y == 2.0) ? 1.0 : 0.0;
    else if (brightness < 0.5) val = (grid.y == 1.0 || grid.y == 2.0) ? 1.0 : 0.0;
    else if (brightness < 0.65) val = (grid.y == 0.0 || grid.y == 3.0) ? 1.0 : (grid.y == 1.0 || grid.y == 2.0) ? 0.5 : 0.0;
    else if (brightness < 0.8) val = (grid.x == 0.0 || grid.x == 2.0 || grid.y == 0.0 || grid.y == 2.0) ? 1.0 : 0.3;
    else val = 1.0;
  }
  return val;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 workUV = uv;

  // CORE ASCII RENDERING
  vec2 cellCount = resolution / cellSize;
  vec2 cellCoord = floor(uv * cellCount);
  vec2 cellUV = (cellCoord + 0.5) / cellCount;
  vec4 cellColor = texture(inputBuffer, cellUV);

  // Contrast and brightness
  cellColor.rgb = (cellColor.rgb - 0.5) * contrastAdjust + 0.5 + brightnessAdjust;

  float brightness = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));
  if (invert) brightness = 1.0 - brightness;

  vec2 localUV = fract(uv * cellCount);
  float charValue = getChar(brightness, localUV, asciiStyle);

  vec3 finalColor;
  if (colorMode) {
    finalColor = cellColor.rgb * charValue;
  } else {
    finalColor = vec3(brightness * charValue);
  }

  // Color Palette
  finalColor = applyColorPalette(finalColor, colorPalette);

  // Mouse glow
  if (mouseGlowEnabled) {
    vec2 pixelPos = uv * resolution;
    float dist = length(pixelPos - mousePos);
    float glow = exp(-dist / mouseGlowRadius) * mouseGlowIntensity;
    finalColor += glow;
  }

  outputColor = vec4(finalColor, cellColor.a);
}
`

// Module-level variables for state management
let _time = 0
let _deltaAccumulator = 0

class AsciiEffectImpl extends Effect {
  constructor(options: any) {
    const {
      cellSize = 8,
      invert = false,
      color = true,
      style = 0,
      resolution = new Vector2(1920, 1080),
      mousePos = new Vector2(0, 0),
      postfx = {}
    } = options

    super("AsciiEffect", fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ["cellSize", new Uniform(cellSize)],
        ["invert", new Uniform(invert)],
        ["colorMode", new Uniform(color)],
        ["asciiStyle", new Uniform(style)],
        ["time", new Uniform(0)],
        ["resolution", new Uniform(resolution)],
        ["mousePos", new Uniform(mousePos)],
        ["scanlineIntensity", new Uniform(postfx.scanlineIntensity || 0)],
        ["scanlineCount", new Uniform(postfx.scanlineCount || 200)],
        ["targetFPS", new Uniform(postfx.targetFPS || 0)],
        ["jitterIntensity", new Uniform(postfx.jitterIntensity || 0)],
        ["jitterSpeed", new Uniform(postfx.jitterSpeed || 1)],
        ["mouseGlowEnabled", new Uniform(postfx.mouseGlowEnabled || false)],
        ["mouseGlowRadius", new Uniform(postfx.mouseGlowRadius || 200)],
        ["mouseGlowIntensity", new Uniform(postfx.mouseGlowIntensity || 1.5)],
        ["vignetteIntensity", new Uniform(postfx.vignetteIntensity || 0)],
        ["vignetteRadius", new Uniform(postfx.vignetteRadius || 0.8)],
        ["colorPalette", new Uniform(postfx.colorPalette || 0)],
        ["curvature", new Uniform(postfx.curvature || 0)],
        ["aberrationStrength", new Uniform(postfx.aberrationStrength || 0)],
        ["noiseIntensity", new Uniform(postfx.noiseIntensity || 0)],
        ["noiseScale", new Uniform(postfx.noiseScale || 1)],
        ["noiseSpeed", new Uniform(postfx.noiseSpeed || 1)],
        ["waveAmplitude", new Uniform(postfx.waveAmplitude || 0)],
        ["waveFrequency", new Uniform(postfx.waveFrequency || 10)],
        ["waveSpeed", new Uniform(postfx.waveSpeed || 1)],
        ["glitchIntensity", new Uniform(postfx.glitchIntensity || 0)],
        ["glitchFrequency", new Uniform(postfx.glitchFrequency || 0)],
        ["brightnessAdjust", new Uniform(postfx.brightnessAdjust || 0)],
        ["contrastAdjust", new Uniform(postfx.contrastAdjust || 1)],
      ]),
    })
  }

  update(_renderer: any, _inputBuffer: any, deltaTime: number) {
    const targetFPS = this.uniforms.get("targetFPS")!.value

    if (targetFPS > 0) {
      const frameDuration = 1 / targetFPS
      _deltaAccumulator += deltaTime
      if (_deltaAccumulator >= frameDuration) {
        _time += frameDuration
        _deltaAccumulator = _deltaAccumulator % frameDuration
      }
    } else {
      _time += deltaTime
    }

    this.uniforms.get("time")!.value = _time
  }
}

export const AsciiEffect = forwardRef<any, any>((props: any, ref) => {
  const {
    style = "standard",
    cellSize = 8,
    invert = false,
    color = true,
    postfx = {},
    resolution = new Vector2(1920, 1080),
    mousePos = new Vector2(0, 0)
  } = props

  const styleMap: any = { standard: 0, dense: 1, minimal: 2, blocks: 3 }
  const styleNum = styleMap[style] || 0

  const effect = useMemo(
    () => new AsciiEffectImpl({ cellSize, invert, color, style: styleNum, postfx, resolution, mousePos }),
    []
  )

  useEffect(() => {
    effect.uniforms.get("cellSize")!.value = cellSize
    effect.uniforms.get("invert")!.value = invert
    effect.uniforms.get("colorMode")!.value = color
    effect.uniforms.get("asciiStyle")!.value = styleNum
    effect.uniforms.get("resolution")!.value = resolution
    effect.uniforms.get("mousePos")!.value = mousePos

    // Update PostFX uniforms
    const uniforms = effect.uniforms
    if (postfx) {
      if (postfx.scanlineIntensity !== undefined) uniforms.get("scanlineIntensity")!.value = postfx.scanlineIntensity
      if (postfx.scanlineCount !== undefined) uniforms.get("scanlineCount")!.value = postfx.scanlineCount
      if (postfx.targetFPS !== undefined) uniforms.get("targetFPS")!.value = postfx.targetFPS
      if (postfx.jitterIntensity !== undefined) uniforms.get("jitterIntensity")!.value = postfx.jitterIntensity
      if (postfx.jitterSpeed !== undefined) uniforms.get("jitterSpeed")!.value = postfx.jitterSpeed
      if (postfx.mouseGlowEnabled !== undefined) uniforms.get("mouseGlowEnabled")!.value = postfx.mouseGlowEnabled
      if (postfx.mouseGlowRadius !== undefined) uniforms.get("mouseGlowRadius")!.value = postfx.mouseGlowRadius
      if (postfx.mouseGlowIntensity !== undefined) uniforms.get("mouseGlowIntensity")!.value = postfx.mouseGlowIntensity
      if (postfx.vignetteIntensity !== undefined) uniforms.get("vignetteIntensity")!.value = postfx.vignetteIntensity
      if (postfx.vignetteRadius !== undefined) uniforms.get("vignetteRadius")!.value = postfx.vignetteRadius
      if (postfx.colorPalette !== undefined) uniforms.get("colorPalette")!.value = typeof postfx.colorPalette === 'string' ? 0 : postfx.colorPalette
      if (postfx.curvature !== undefined) uniforms.get("curvature")!.value = postfx.curvature
      if (postfx.aberrationStrength !== undefined) uniforms.get("aberrationStrength")!.value = postfx.aberrationStrength
      if (postfx.noiseIntensity !== undefined) uniforms.get("noiseIntensity")!.value = postfx.noiseIntensity
      if (postfx.noiseScale !== undefined) uniforms.get("noiseScale")!.value = postfx.noiseScale
      if (postfx.noiseSpeed !== undefined) uniforms.get("noiseSpeed")!.value = postfx.noiseSpeed
      if (postfx.waveAmplitude !== undefined) uniforms.get("waveAmplitude")!.value = postfx.waveAmplitude
      if (postfx.waveFrequency !== undefined) uniforms.get("waveFrequency")!.value = postfx.waveFrequency
      if (postfx.waveSpeed !== undefined) uniforms.get("waveSpeed")!.value = postfx.waveSpeed
      if (postfx.glitchIntensity !== undefined) uniforms.get("glitchIntensity")!.value = postfx.glitchIntensity
      if (postfx.glitchFrequency !== undefined) uniforms.get("glitchFrequency")!.value = postfx.glitchFrequency
      if (postfx.brightnessAdjust !== undefined) uniforms.get("brightnessAdjust")!.value = postfx.brightnessAdjust
      if (postfx.contrastAdjust !== undefined) uniforms.get("contrastAdjust")!.value = postfx.contrastAdjust
    }
  }, [cellSize, invert, color, styleNum, resolution, mousePos, postfx, effect])

  return <primitive ref={ref} object={effect} dispose={null} />
})

AsciiEffect.displayName = "AsciiEffect"
