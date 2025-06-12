// utils/libassRenderer.ts
import LibAVASSWASM from "libass-wasm";

let assInstance: any = null;
let canvasContext: CanvasRenderingContext2D | null = null;

export async function initLibass(canvas: HTMLCanvasElement) {
    const libass = await LibAVASSWASM();
    canvasContext = canvas.getContext("2d");
    assInstance = libass.createCanvas(canvas);
    return assInstance;
}

export async function loadSubtitles(content: string) {
    if (!assInstance) return;
    assInstance.createTrack(content);
}

export function renderFrame(time: number) {
    if (!assInstance || !canvasContext) return;
    assInstance.render(time * 1000); // libass expects milliseconds
}
