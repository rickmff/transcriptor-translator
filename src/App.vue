<template>
  <div
    class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12"
  >
    <div class="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
      <div
        class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
      ></div>
      <div
        class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20"
      >
        <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">
          Voice Transcriptor & Translator
        </h1>

        <div
          v-if="!isSupported"
          class="mb-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700"
        >
          <p class="font-bold">Error</p>
          <p>Speech recognition is not supported in this browser.</p>
        </div>

        <div v-else>
          <button
            @click="isListening ? stop() : start()"
            class="w-full mb-8 px-4 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors duration-200"
            :class="
              isListening
                ? 'bg-red-500 hover:bg-red-700 focus:ring-red-400'
                : 'bg-green-500 hover:bg-green-700 focus:ring-green-400'
            "
          >
            {{ isListening ? "Stop Listening" : "Start Listening" }}
          </button>

          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-700 mb-2">
              Transcript:
            </h2>
            <div
              class="p-4 bg-gray-50 rounded-lg min-h-[100px] max-h-[200px] overflow-y-auto"
            >
              {{
                transcript || "Start speaking to see your transcript here..."
              }}
            </div>
          </div>

          <div class="mb-8">
            <label
              for="targetLang"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Target Language:</label
            >
            <select
              id="targetLang"
              v-model="targetLang"
              class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
            </select>
          </div>

          <button
            @click="translateTranscript"
            class="w-full mb-8 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200"
            :disabled="isTranslating || !transcript"
          >
            <span v-if="isTranslating">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Translating...
            </span>
            <span v-else>Translate</span>
          </button>

          <div
            v-if="error"
            class="mb-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700"
          >
            <p class="font-bold">Error</p>
            <p>{{ error }}</p>
          </div>

          <div v-if="translatedText">
            <h2 class="text-xl font-semibold text-gray-700 mb-2">
              Translated Text:
            </h2>
            <div
              class="p-4 bg-gray-50 rounded-lg min-h-[100px] max-h-[200px] overflow-y-auto"
            >
              {{ translatedText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSpeechRecognition } from "./composable/useSpeechRecognition";
import { useTranslator } from "./composable/useTranslator";
import { type LanguageCode } from "open-google-translator"

const { transcript, isListening, isSupported, start, stop } =
  useSpeechRecognition();
const { translateText, isTranslating, translatedText, error } = useTranslator();

const targetLang = ref<LanguageCode>("fr");

const translateTranscript = () => {
  translateText(transcript.value, "fr", targetLang.value);
};
</script>
