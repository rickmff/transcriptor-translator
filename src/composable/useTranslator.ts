import { ref } from 'vue'
import translator, { type LanguageCode } from "open-google-translator"
export function useTranslator() {
    const supportedLanguages = ref<Record<LanguageCode, string>>({} as Record<LanguageCode, string>)
    const translatedText = ref('')
    const isTranslating = ref(false)
    const error = ref<string | null>(null)

    const getSupportedLanguages = async () => {
        try {
            supportedLanguages.value = await translator.supportedLanguages()
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'An unknown error occurred'
        }
    }

    const translateText = async (text: string | string[], fromLanguage: LanguageCode, toLanguage: LanguageCode) => {
        isTranslating.value = true
        error.value = null

        try {
            const data = await translator.TranslateLanguageData({
                listOfWordsToTranslate: Array.isArray(text) ? text : [text],
                fromLanguage,
                toLanguage,
            })
            translatedText.value = Array.isArray(data) ? data.join(' ') : data
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'An unknown error occurred'
        } finally {
            isTranslating.value = false
        }
    }

    return {
        supportedLanguages,
        translatedText,
        isTranslating,
        error,
        getSupportedLanguages,
        translateText
    }
}