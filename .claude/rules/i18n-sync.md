# Always Update All Locales When Changing Docs

When modifying any documentation source file (.rst/.md), always update all locale .po files to maintain translation coverage.

## Steps

1. After editing a source file, run `make message-PO` or `sphinx-build -b gettext` to update .pot files
2. Update all .po files for every configured locale via `msgmerge` or `sphinx-build -D language=<code>`
3. Translate any new msgid entries before committing
4. Set `Last-Translator` to `baseplate-admin <61817579+baseplate-admin@users.noreply.github.com>`
5. Set `Language-Team` to `<code> <LL@li.org>`

## Configured Locales

ar, bn, de, es, fa, fr, hi, id, it, ja, ko, ml, pl, pt, ru, th, tr, uk, vi, zh

## Rule

**No doc change goes out without all locales being updated.** If a msgid has no translation yet, translate it before committing.
