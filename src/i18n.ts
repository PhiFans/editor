import i18n, { InitOptions } from 'i18next';
import ChainedBackend, { ChainedBackendOptions } from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const I18nConfig: InitOptions<ChainedBackendOptions> = {
  backend: {
    backends: [
      HttpBackend,
    ],
    backendOptions: [
      {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    ],
  },
  debug: import.meta.env.DEV,
  fallbackLng: 'en-US',
};

if (!__IS_TAURI__) {
  I18nConfig.backend!.backends!.unshift(LocalStorageBackend);
  I18nConfig.backend!.backendOptions!.unshift({
    prefix: 'i18n_cache_',
  });
}

i18n
  .use(ChainedBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(I18nConfig)
  .then(() => void 0)
  .catch((e) => console.error(e));

export default i18n;
