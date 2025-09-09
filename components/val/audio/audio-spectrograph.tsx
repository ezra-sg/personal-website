import { useCallback, useEffect, useRef } from 'react';

import { AudioStatus, useAudioContext } from '@/hooks/useAudioContext';
import usePrefersDarkMode from '@/hooks/usePrefersDarkMode';

const ORANGE_300 = '#fdba74';
const AMBER_900 = '#78350f';

export function AudioSpectrograph({ snippetId }: React.PropsWithChildren<{ snippetId: string }>) {
    const color = useRef(ORANGE_300);
    const isPlaying = useRef(false);
    const animationId = useRef<null | number>(null);
    const spectrographElementRef = useRef<HTMLCanvasElement | null>(null);
    const drawFunctionRef = useRef<null | ((analyzer: AnalyserNode, dataArray: Uint8Array) => void)>(null);

    const prefersDarkMode = usePrefersDarkMode();

    const {
        audioElement,
        subscribe,
        unsubscribe,
        audioAnalyser,
    } = useAudioContext();

    function drawLineOnCanvas(canvas: HTMLCanvasElement) {
        const canvasCtx = canvas?.getContext('2d');

        if (!canvasCtx) {
            return;
        }

        const middleY = Math.floor(canvas.height / 2) + 0.5; // Add 0.5 to align the line on a pixel boundary

        canvasCtx.beginPath(); // Start a new path
        canvasCtx.moveTo(0, middleY); // Move to the start of the line
        canvasCtx.lineTo(canvas.width, middleY); // Draw the line
        canvasCtx.strokeStyle = color.current; // Set the color of the line
        canvasCtx.lineWidth = 1; // Set the line width to 1 pixel
        canvasCtx.stroke(); // Render the line
    }

    const draw = useCallback((analyzer: AnalyserNode, dataArray: Uint8Array) => {
        const canvas = spectrographElementRef.current;
        const canvasCtx = canvas?.getContext('2d');

        if (!canvas || !canvasCtx) {
            return;
        }

        const barWidth = (canvas.width / 24) / 2;

        analyzer.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        drawLineOnCanvas(canvas);

        for (let i = 0; i < 24; i++) {
            const value = dataArray[i]; // Value between 0 and 255
            const percent = value / 255; // Percentage of max height
            const height = canvas.height * percent;
            const barHeight = height / 2;

            canvasCtx.fillStyle = color.current;
            canvasCtx.fillRect(i * barWidth * 2, canvas.height/2, barWidth, barHeight);
            // Mirror the bar across the x-axis
            canvasCtx.fillRect(i * barWidth * 2, (canvas.height - barHeight) - (canvas.height / 2), barWidth, barHeight);
        }

        if (isPlaying.current) {
            animationId.current = window.requestAnimationFrame(() => {
                drawFunctionRef.current?.(analyzer, dataArray);
            });
        } else {
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            drawLineOnCanvas(canvas);
        }
    }, []);
    drawFunctionRef.current = draw;

    useEffect(() => {
        drawLineOnCanvas(spectrographElementRef.current!);
    }, []);

    useEffect(() => {
        color.current = prefersDarkMode ? ORANGE_300 : AMBER_900;
    }, [prefersDarkMode]);

    useEffect(() => {
        const { playing } = AudioStatus;

        const handler = (status: AudioStatus) => {
            isPlaying.current = status === playing;

            if (status === playing && audioElement && audioAnalyser && spectrographElementRef.current) {
                const bufferLength = audioAnalyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                drawFunctionRef.current?.(audioAnalyser, dataArray);
            }
        };

        subscribe(snippetId, handler);

        return () => {
            unsubscribe(snippetId, handler);
        };
    }, [audioElement, audioAnalyser, subscribe, unsubscribe, snippetId]);

    return <canvas ref={spectrographElementRef} className="w-40 h-14"></canvas>;
}
