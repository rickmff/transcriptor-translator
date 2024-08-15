import { ref, onMounted, onUnmounted } from 'vue'

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export function useSpeechRecognition() {
  const transcript = ref('')
  const isListening = ref(false)
  const isSupported = ref(false)

  let recognition: SpeechRecognition | null = null

  onMounted(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      isSupported.value = true
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition
      recognition = new SpeechRecognitionConstructor()
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        transcript.value = finalTranscript + interimTranscript
      }

      recognition.onstart = () => {
        isListening.value = true
      }

      recognition.onend = () => {
        isListening.value = false
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        isListening.value = false
      }
    }
  })

  onUnmounted(() => {
    if (recognition) {
      recognition.stop()
    }
  })

  const start = () => {
    if (recognition && !isListening.value) {
      recognition.start()
    }
  }

  const stop = () => {
    if (recognition && isListening.value) {
      recognition.stop()
    }
  }

  return {
    transcript,
    isListening,
    isSupported,
    start,
    stop
  }
}