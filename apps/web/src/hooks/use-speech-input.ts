"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Minimal Web Speech API types (built into Chrome/Edge/Safari). */
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: { [index: number]: { transcript: string } | undefined };
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export type SpeechInputStatus = "idle" | "listening" | "unsupported" | "denied";

/**
 * Browser speech-to-text for the chat mic button (demo).
 * Uses the Web Speech API — no audio is sent to our backend in this UI-only build.
 */
export function useSpeechInput(onTranscript: (text: string) => void) {
  const [status, setStatus] = useState<SpeechInputStatus>("idle");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const Ctor =
      typeof window !== "undefined"
        ? window.SpeechRecognition ?? window.webkitSpeechRecognition
        : undefined;

    if (!Ctor) {
      setStatus("unsupported");
      return;
    }

    const recognition = new Ctor();
    recognition.lang = "en-GB";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let chunk = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        chunk += event.results[i]?.[0]?.transcript ?? "";
      }
      if (chunk.trim()) onTranscript(chunk);
    };

    recognition.onend = () => setStatus("idle");

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") setStatus("denied");
      else setStatus("idle");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [onTranscript]);

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setStatus("unsupported");
      return;
    }

    if (status === "listening") {
      recognition.stop();
      setStatus("idle");
      return;
    }

    try {
      recognition.start();
      setStatus("listening");
    } catch {
      setStatus("idle");
    }
  }, [status]);

  return { status, toggleListening };
}
