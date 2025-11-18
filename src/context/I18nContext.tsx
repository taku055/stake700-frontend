// i18n.ts
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { ComponentChildren, createContext, FunctionalComponent } from "preact";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";

interface I18nContexttProps {
  messages: Record<string, any>;
}

const I18nContext = createContext<I18nContexttProps>({
  messages: {},
});

interface I18nProviderProps {
  messages: Record<string, any>;
  children: ComponentChildren;
}

export const I18nProvider: FunctionalComponent<I18nProviderProps> = (props) => {
  const [messages, setMessages] = useState<Record<string, any>>({});

  useEffect(() => {
    setMessages(props.messages);
  }, [props.messages]);

  return (
    <I18nContext.Provider value={{ messages: messages }}>
      {props.children}
    </I18nContext.Provider>
  );
};

// --- helpers ---
export const get = (obj: any, path: string, values?: Record<string, any>): any => {
  if (!obj) return null;
  
  const i = path.indexOf(".");
  if (i < 0) {
    let res = obj[path];
    if (res) {
      if (values) {
        for (const key in values) {
          res = res.replaceAll(`{${key}}`, values[key]);
        }
      }

      res = res.replaceAll(`{currency_symbol}`, DEFAULT_CURRENCY_SYMBOL);
    }

    return res;
  }

  const k = path.substring(0, i);
  return k in obj ? get(obj[k], path.substring(i + 1), values) : null;
};

export function t(key: string, values?: Record<string, any>, fallback?: string) {
  const { messages } = useContext(I18nContext);
  const raw = get(messages, key, values);
  if (raw == null) return fallback ?? key;
  return raw;
}

export const useTranslations = (ns: string) => {
  const { messages } = useContext(I18nContext);

  const tx = useMemo(() => {
    return (key: string, values?: Record<string, any>, fallback?: string) => {
      const fullKey = ns ? `${ns}.${key}` : key;
      const raw = get(messages, fullKey, values);
      return raw ?? fallback ?? `${ns}.${key}`;
    };
  }, [messages, ns]);

  return tx;
};
