#!/usr/bin/env python3
"""Apply i18n translation patches. Run from repo root: python3 scripts/i18n_apply_translations.py"""
from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
I18N = ROOT / "src" / "assets" / "i18n"


def deep_merge(base: dict, patch: dict) -> dict:
    for k, v in patch.items():
        if k in base and isinstance(base[k], dict) and isinstance(v, dict):
            deep_merge(base[k], v)
        else:
            base[k] = v
    return base


def insert_after(data: dict, after_key: str, new_key: str, new_val: dict) -> None:
    if new_key in data:
        data[new_key] = deep_merge(data.get(new_key, {}), new_val) if isinstance(new_val, dict) else new_val
        return
    out = {}
    inserted = False
    for k, v in data.items():
        out[k] = v
        if k == after_key:
            out[new_key] = new_val
            inserted = True
    if not inserted:
        out[new_key] = new_val
    data.clear()
    data.update(out)


# --- Missing keys for all non-en locales (15 keys) ---
MISSING_I18N: dict[str, dict[str, str]] = {
    "ar": {
        "Common.Yes": "نعم",
        "Common.No": "لا",
        "Common.N/A": "غير متاح",
        "Common.Change Locale": "تغيير اللغة",
        "Common.Language": "اللغة",
        "Common.Change language": "تغيير اللغة",
        "Footer.question_6": "ما الرياضات التي يمكنني الرهان عليها؟",
        "Footer.answer_6": "يمكنك الرهان على مجموعة واسعة من الرياضات بما في ذلك كرة القدم وكرة السلة والتنس والكريكيت والرياضات الإلكترونية والفنون القتالية المختلطة والملاكمة والعديد من الرياضات الدولية الشائعة الأخرى.",
        "Footer.question_7": "كيف أشاهد البث المباشر؟",
        "Footer.answer_7": "تتوفر البثوث المباشرة مباشرة على منصة Betalarab لفعاليات رياضية مختارة. انتقل إلى قسم الرياضة، واختر فعالية بها بث مباشر، وشاهد في الوقت الفعلي.",
        "HomePage.no_games_found": "لا توجد ألعاب في هذه الفئة",
        "SignupDialog.already_have_an_account": "لديك حساب بالفعل؟",
        "ToastMessages.info.wallet_address_copied": "تم نسخ عنوان المحفظة إلى الحافظة!",
        "ToastMessages.aria.copy_address": "نسخ العنوان",
        "ToastMessages.aria.refresh_address": "تحديث العنوان",
    },
    "ru": {
        "Common.Yes": "Да",
        "Common.No": "Нет",
        "Common.N/A": "Н/Д",
        "Common.Change Locale": "Сменить язык",
        "Common.Language": "Язык",
        "Common.Change language": "Сменить язык",
        "Footer.question_6": "На какие виды спорта можно делать ставки?",
        "Footer.answer_6": "Вы можете делать ставки на широкий выбор видов спорта, включая футбол, баскетбол, теннис, крикет, киберспорт, MMA, бокс и многие другие популярные международные виды спорта.",
        "Footer.question_7": "Как смотреть прямые трансляции?",
        "Footer.answer_7": "Прямые трансляции доступны на платформе Betalarab для выбранных спортивных событий. Перейдите в раздел спорта, выберите событие с включённой трансляцией и смотрите в реальном времени.",
        "HomePage.no_games_found": "В этой категории игры не найдены",
        "SignupDialog.already_have_an_account": "Уже есть аккаунт?",
        "ToastMessages.info.wallet_address_copied": "Адрес кошелька скопирован в буфер обмена!",
        "ToastMessages.aria.copy_address": "Копировать адрес",
        "ToastMessages.aria.refresh_address": "Обновить адрес",
    },
    "de": {
        "Common.Yes": "Ja",
        "Common.No": "Nein",
        "Common.N/A": "k. A.",
        "Common.Change Locale": "Sprache ändern",
        "Common.Language": "Sprache",
        "Common.Change language": "Sprache ändern",
        "Footer.question_6": "Auf welche Sportarten kann ich wetten?",
        "Footer.answer_6": "Sie können auf eine große Auswahl an Sportarten wetten, darunter Fußball, Basketball, Tennis, Cricket, E-Sport, MMA, Boxen und viele andere beliebte internationale Sportarten.",
        "Footer.question_7": "Wie kann ich Livestreams ansehen?",
        "Footer.answer_7": "Livestreams sind direkt auf der Betalarab-Plattform für ausgewählte Sportereignisse verfügbar. Gehen Sie zum Sportbereich, wählen Sie ein Ereignis mit aktiviertem Livestream und sehen Sie in Echtzeit zu.",
        "HomePage.no_games_found": "Keine Spiele in dieser Kategorie gefunden",
        "SignupDialog.already_have_an_account": "Haben Sie bereits ein Konto?",
        "ToastMessages.info.wallet_address_copied": "Wallet-Adresse in die Zwischenablage kopiert!",
        "ToastMessages.aria.copy_address": "Adresse kopieren",
        "ToastMessages.aria.refresh_address": "Adresse aktualisieren",
    },
    "fr": {
        "Common.Yes": "Oui",
        "Common.No": "Non",
        "Common.N/A": "N/A",
        "Common.Change Locale": "Changer de langue",
        "Common.Language": "Langue",
        "Common.Change language": "Changer de langue",
        "Footer.question_6": "Sur quels sports puis-je parier ?",
        "Footer.answer_6": "Vous pouvez parier sur une large gamme de sports, notamment le football, le basket-ball, le tennis, le cricket, l’esport, le MMA, la boxe et bien d’autres sports internationaux populaires.",
        "Footer.question_7": "Comment regarder les flux en direct ?",
        "Footer.answer_7": "Les flux en direct sont disponibles directement sur la plateforme Betalarab pour certains événements sportifs. Allez dans la section sports, choisissez un événement avec diffusion en direct et regardez en temps réel.",
        "HomePage.no_games_found": "Aucun jeu trouvé pour cette catégorie",
        "SignupDialog.already_have_an_account": "Vous avez déjà un compte ?",
        "ToastMessages.info.wallet_address_copied": "Adresse du portefeuille copiée dans le presse-papiers !",
        "ToastMessages.aria.copy_address": "Copier l’adresse",
        "ToastMessages.aria.refresh_address": "Actualiser l’adresse",
    },
    "es": {
        "Common.Yes": "Sí",
        "Common.No": "No",
        "Common.N/A": "N/D",
        "Common.Change Locale": "Cambiar idioma",
        "Common.Language": "Idioma",
        "Common.Change language": "Cambiar idioma",
        "Footer.question_6": "¿En qué deportes puedo apostar?",
        "Footer.answer_6": "Puedes apostar a una amplia gama de deportes, incluidos fútbol, baloncesto, tenis, cricket, esports, MMA, boxeo y muchos otros deportes internacionales populares.",
        "Footer.question_7": "¿Cómo veo transmisiones en vivo?",
        "Footer.answer_7": "Las transmisiones en vivo están disponibles directamente en la plataforma Betalarab para eventos deportivos seleccionados. Ve a la sección de deportes, elige un evento con transmisión en vivo y mira en tiempo real.",
        "HomePage.no_games_found": "No se encontraron juegos en esta categoría",
        "SignupDialog.already_have_an_account": "¿Ya tienes una cuenta?",
        "ToastMessages.info.wallet_address_copied": "¡Dirección de la billetera copiada al portapapeles!",
        "ToastMessages.aria.copy_address": "Copiar dirección",
        "ToastMessages.aria.refresh_address": "Actualizar dirección",
    },
    "it": {
        "Common.Yes": "Sì",
        "Common.No": "No",
        "Common.N/A": "N/D",
        "Common.Change Locale": "Cambia lingua",
        "Common.Language": "Lingua",
        "Common.Change language": "Cambia lingua",
        "Footer.question_6": "Su quali sport posso scommettere?",
        "Footer.answer_6": "Puoi scommettere su un’ampia gamma di sport, tra cui calcio, basket, tennis, cricket, esports, MMA, boxe e molti altri sport internazionali popolari.",
        "Footer.question_7": "Come guardo le dirette streaming?",
        "Footer.answer_7": "Le dirette sono disponibili sulla piattaforma Betalarab per eventi sportivi selezionati. Vai alla sezione sport, scegli un evento con streaming attivo e guarda in tempo reale.",
        "HomePage.no_games_found": "Nessun gioco trovato per questa categoria",
        "SignupDialog.already_have_an_account": "Hai già un account?",
        "ToastMessages.info.wallet_address_copied": "Indirizzo del portafoglio copiato negli appunti!",
        "ToastMessages.aria.copy_address": "Copia indirizzo",
        "ToastMessages.aria.refresh_address": "Aggiorna indirizzo",
    },
    "pt": {
        "Common.Yes": "Sim",
        "Common.No": "Não",
        "Common.N/A": "N/D",
        "Common.Change Locale": "Alterar idioma",
        "Common.Language": "Idioma",
        "Common.Change language": "Alterar idioma",
        "Footer.question_6": "Em quais esportes posso apostar?",
        "Footer.answer_6": "Você pode apostar em uma ampla variedade de esportes, incluindo futebol, basquete, tênis, críquete, esports, MMA, boxe e muitos outros esportes internacionais populares.",
        "Footer.question_7": "Como assisto a transmissões ao vivo?",
        "Footer.answer_7": "As transmissões ao vivo estão disponíveis diretamente na plataforma Betalarab para eventos esportivos selecionados. Vá à seção de esportes, escolha um evento com transmissão ao vivo e assista em tempo real.",
        "HomePage.no_games_found": "Nenhum jogo encontrado nesta categoria",
        "SignupDialog.already_have_an_account": "Já tem uma conta?",
        "ToastMessages.info.wallet_address_copied": "Endereço da carteira copiado para a área de transferência!",
        "ToastMessages.aria.copy_address": "Copiar endereço",
        "ToastMessages.aria.refresh_address": "Atualizar endereço",
    },
    "tr": {
        "Footer.question_6": "Hangi sporlara bahis yapabilirim?",
        "Footer.answer_6": "Futbol, basketbol, tenis, kriket, espor, MMA, boks ve diğer birçok popüler uluslararası spor dahil geniş bir yelpazede bahis yapabilirsiniz.",
        "Footer.question_7": "Canlı yayınları nasıl izlerim?",
        "Footer.answer_7": "Canlı yayınlar, seçili spor etkinlikleri için doğrudan Betalarab platformunda mevcuttur. Spor bölümüne gidin, canlı yayını açık bir etkinlik seçin ve gerçek zamanlı izleyin.",
        "HomePage.no_games_found": "Bu kategori için oyun bulunamadı",
        "SignupDialog.already_have_an_account": "Zaten hesabınız var mı?",
    },
    "az": {
        "Common.Yes": "Bəli",
        "Common.No": "Xeyr",
        "Common.N/A": "Yoxdur",
        "Common.Change Locale": "Dili dəyiş",
        "Common.Language": "Dil",
        "Common.Change language": "Dili dəyiş",
        "Footer.question_6": "Hansı idman növlərinə mərc edə bilərəm?",
        "Footer.answer_6": "Futbol, basketbol, tennis, kriket, esport, MMA, boks və digər məşhur beynəlxalq idman növlərinə geniş spektrdə mərc edə bilərsiniz.",
        "Footer.question_7": "Canlı yayımları necə izləyim?",
        "Footer.answer_7": "Canlı yayımlar seçilmiş idman hadisələri üçün birbaşa Betalarab platformasında mövcuddur. İdman bölməsinə keçin, canlı yayımla hadisə seçin və real vaxtda izləyin.",
        "HomePage.no_games_found": "Bu kateqoriya üçün oyun tapılmadı",
        "SignupDialog.already_have_an_account": "Artıq hesabınız var?",
        "ToastMessages.info.wallet_address_copied": "Ünvan mübadilə yaddaşına kopyalandı!",
        "ToastMessages.aria.copy_address": "Ünvanı kopyala",
        "ToastMessages.aria.refresh_address": "Ünvanı yenilə",
    },
    "fa": {
        "Common.Yes": "بله",
        "Common.No": "خیر",
        "Common.N/A": "نامشخص",
        "Common.Change Locale": "تغییر زبان",
        "Common.Language": "زبان",
        "Common.Change language": "تغییر زبان",
        "Footer.question_6": "روی چه ورزش‌هایی می‌توانم شرط ببندم؟",
        "Footer.answer_6": "می‌توانید روی طیف گسترده‌ای از ورزش‌ها از جمله فوتبال، بسکتبال، تنیس، کریکت، ورزش‌های الکترونیکی، MMA، بوکس و بسیاری دیگر شرط ببندید.",
        "Footer.question_7": "پخش زنده را چگونه ببینم؟",
        "Footer.answer_7": "پخش‌های زنده برای رویدادهای ورزشی منتخب مستقیماً در پلتفرم Betalarab در دسترس است. به بخش ورزش بروید، رویدادی با پخش زنده فعال انتخاب کنید و به‌صورت لحظه‌ای تماشا کنید.",
        "HomePage.no_games_found": "بازی‌ای برای این دسته یافت نشد",
        "SignupDialog.already_have_an_account": "قبلاً حساب دارید؟",
        "ToastMessages.info.wallet_address_copied": "آدرس کیف پول در کلیپ‌بورد کپی شد!",
        "ToastMessages.aria.copy_address": "کپی آدرس",
        "ToastMessages.aria.refresh_address": "به‌روزرسانی آدرس",
    },
    "he": {
        "Common.Yes": "כן",
        "Common.No": "לא",
        "Common.N/A": "לא זמין",
        "Common.Change Locale": "החלפת שפה",
        "Common.Language": "שפה",
        "Common.Change language": "החלפת שפה",
        "Footer.question_6": "על אילו ספורט אפשר להמר?",
        "Footer.answer_6": "ניתן להמר על מגוון רחב של ענפי ספורט, כולל כדורגל, כדורסל, טניס, קריקט, ספורט אלקטרוני, MMA, אגרוף ועוד רבים.",
        "Footer.question_7": "איך צופים בשידורים חיים?",
        "Footer.answer_7": "שידורים חיים זמינים ישירות בפלטפורמת Betalarab לאירועי ספורט נבחרים. עברו לקטגוריית הספורט, בחרו אירוע עם שידור חי וצפו בזמן אמת.",
        "HomePage.no_games_found": "לא נמצאו משחקים בקטגוריה זו",
        "SignupDialog.already_have_an_account": "כבר יש לך חשבון?",
        "ToastMessages.info.wallet_address_copied": "כתובת הארנק הועתקה ללוח!",
        "ToastMessages.aria.copy_address": "העתק כתובת",
        "ToastMessages.aria.refresh_address": "רענן כתובת",
    },
    "el": {
        "Common.Yes": "Ναι",
        "Common.No": "Όχι",
        "Common.N/A": "Δ/Υ",
        "Common.Change Locale": "Αλλαγή γλώσσας",
        "Common.Language": "Γλώσσα",
        "Common.Change language": "Αλλαγή γλώσσας",
        "Footer.question_6": "Σε ποια αθλήματα μπορώ να στοιχηματίσω;",
        "Footer.answer_6": "Μπορείτε να στοιχηματίσετε σε ευρεία γκάμα αθλημάτων, όπως ποδόσφαιρο, μπάσκετ, τένις, κρίκετ, esports, MMA, πυγμαχία και πολλά άλλα.",
        "Footer.question_7": "Πώς παρακολουθώ ζωντανές μεταδόσεις;",
        "Footer.answer_7": "Οι ζωντανές μεταδόσεις είναι διαθέσιμες απευθείας στην πλατφόρμα Betalarab για επιλεγμένα αθλητικά γεγονότα. Μεταβείτε στην ενότητα αθλημάτων, επιλέξτε γεγονός με ζωντανή μετάδοση και παρακολουθήστε σε πραγματικό χρόνο.",
        "HomePage.no_games_found": "Δεν βρέθηκαν παιχνίδια σε αυτή την κατηγορία",
        "SignupDialog.already_have_an_account": "Έχετε ήδη λογαριασμό;",
        "ToastMessages.info.wallet_address_copied": "Η διεύθυνση πορτοφολιού αντιγράφηκε στο πρόχειρο!",
        "ToastMessages.aria.copy_address": "Αντιγραφή διεύθυνσης",
        "ToastMessages.aria.refresh_address": "Ανανέωση διεύθυνσης",
    },
}


def _sync_faq_from_footer() -> None:
    """Footer and FAQ share the same Q&A text; copy so FAQ page is not left in English."""
    for _loc, patch in MISSING_I18N.items():
        if "Footer.question_6" in patch:
            patch["FAQ.question_6"] = patch["Footer.question_6"]
            patch["FAQ.answer_6"] = patch["Footer.answer_6"]
            patch["FAQ.question_7"] = patch["Footer.question_7"]
            patch["FAQ.answer_7"] = patch["Footer.answer_7"]


_sync_faq_from_footer()


def set_path(d: dict, path: str, value: str) -> None:
    parts = path.split(".")
    cur = d
    for p in parts[:-1]:
        cur = cur.setdefault(p, {})
    cur[parts[-1]] = value


def apply_flat(locale_data: dict, flat: dict[str, str]) -> None:
    for path, value in flat.items():
        set_path(locale_data, path, value)


def patch_locale(code: str) -> None:
    path = I18N / f"{code}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    if code == "en":
        return
    if code in MISSING_I18N:
        apply_flat(data, MISSING_I18N[code])
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    for p in sorted(I18N.glob("*.json")):
        code = p.stem
        if code == "en":
            continue
        patch_locale(code)
    print("Applied missing-key patches to all locales (except en).")


if __name__ == "__main__":
    main()
