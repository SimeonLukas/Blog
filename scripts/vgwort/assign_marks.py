#!/usr/bin/env python3

import csv
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
POSTS_DIR = ROOT / "content" / "posts"
MARKS_FILE = Path(__file__).with_name("marke.csv")
PIXEL_SNIPPET = re.compile(r'<img\b[^>]*\bsrc="(https://[^"]+)"', re.IGNORECASE)
PIXEL_URL = re.compile(
    r"^https://vg\d{2}\.met\.vgwort\.de/na/(?:"
    r"[0-9a-fA-F]{32}|"
    r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-"
    r"[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$"
)


def load_marks(path):
    with path.open(encoding="utf-8-sig", newline="") as marks_file:
        rows = csv.reader(marks_file, delimiter=";")
        marks = []
        for row in rows:
            for cell in row:
                match = PIXEL_SNIPPET.search(cell)
                if match:
                    pixel_url = match.group(1)
                    if not PIXEL_URL.fullmatch(pixel_url):
                        raise ValueError("CSV enthält eine ungültige HTTPS-Zählmarke.")
                    marks.append(pixel_url)

    unique_marks = list(dict.fromkeys(marks))
    if not unique_marks:
        raise ValueError("Keine HTTPS-Zählmarken in der CSV gefunden.")
    if len(unique_marks) != len(marks):
        raise ValueError("Die CSV enthält doppelte Zählmarken.")
    return unique_marks


def split_frontmatter(text, path):
    lines = text.splitlines(keepends=True)
    if not lines or lines[0].strip() != "+++":
        raise ValueError(f"{path}: TOML-Frontmatter mit +++ erwartet.")

    for closing_index in range(1, len(lines)):
        if lines[closing_index].strip() == "+++":
            return lines, closing_index
    raise ValueError(f"{path}: schließendes +++ im Frontmatter fehlt.")


def extra_table_bounds(lines, closing_index):
    table_header = re.compile(r"^\s*\[([^\]]+)\]\s*(?:#.*)?$")
    extra_start = None
    extra_end = closing_index
    for index in range(1, closing_index):
        match = table_header.match(lines[index])
        if not match:
            continue
        if extra_start is not None:
            extra_end = index
            break
        if match.group(1).strip() == "extra":
            extra_start = index
    return extra_start, extra_end


def read_vgwort(lines, closing_index, path):
    extra_start, extra_end = extra_table_bounds(lines, closing_index)
    if extra_start is None:
        return None, None

    key_pattern = re.compile(r"^\s*vgwort\s*=\s*(.*?)\s*(?:#.*)?$")
    found = []
    for index in range(extra_start + 1, extra_end):
        match = key_pattern.match(lines[index])
        if match:
            found.append((index, match.group(1).strip()))
    if len(found) > 1:
        raise ValueError(f"{path}: mehr als ein vgwort-Feld in [extra].")
    if not found:
        return None, None

    index, raw_value = found[0]
    try:
        if raw_value.startswith('"'):
            value = json.loads(raw_value)
        elif raw_value.startswith("'") and raw_value.endswith("'"):
            value = raw_value[1:-1]
        else:
            raise ValueError
    except (json.JSONDecodeError, ValueError):
        raise ValueError(f"{path}: vgwort muss eine TOML-Zeichenkette sein.") from None
    return value or None, index


def set_vgwort(text, pixel_url, path):
    lines, closing_index = split_frontmatter(text, path)
    current, field_index = read_vgwort(lines, closing_index, path)
    if current:
        return text

    newline = "\r\n" if any(line.endswith("\r\n") for line in lines) else "\n"
    field = f"vgwort = {json.dumps(pixel_url)}{newline}"
    if field_index is not None:
        lines[field_index] = field
    else:
        extra_start, _ = extra_table_bounds(lines, closing_index)
        if extra_start is None:
            lines[closing_index:closing_index] = ["[extra]" + newline, field]
            closing_index += 2
        else:
            lines.insert(extra_start + 1, field)
            closing_index += 1
    return "".join(lines)


def assign_marks(posts_dir=POSTS_DIR, marks_file=MARKS_FILE):
    marks = load_marks(marks_file)
    page_names = ("index.md", "index.en.md")
    article_dirs = sorted(
        {
            path.parent
            for name in page_names
            for path in posts_dir.rglob(name)
        }
    )
    if not article_dirs:
        raise ValueError("Keine index.md-Artikel in content/posts gefunden.")

    pages_by_article = {}
    values_by_article = {}
    all_texts = {}
    used_marks = {}
    for article_dir in article_dirs:
        pages = [article_dir / name for name in page_names if (article_dir / name).is_file()]
        pages_by_article[article_dir] = pages
        article_values = set()
        for path in pages:
            text = path.read_text(encoding="utf-8")
            lines, closing_index = split_frontmatter(text, path)
            value, _ = read_vgwort(lines, closing_index, path)
            if value:
                if not PIXEL_URL.fullmatch(value):
                    raise ValueError(f"{path}: vgwort ist keine gültige HTTPS-Zählmarken-URL.")
                article_values.add(value)
            all_texts[path] = text
        if len(article_values) > 1:
            raise ValueError(f"{article_dir}: Sprachfassungen haben unterschiedliche Zählmarken.")
        values_by_article[article_dir] = next(iter(article_values), None)

    for article_dir, pixel_url in values_by_article.items():
        if not pixel_url:
            continue
        previous_article = used_marks.get(pixel_url)
        if previous_article is not None and previous_article != article_dir:
            raise ValueError("Eine Zählmarke ist bereits mehreren Artikeln zugeordnet.")
        used_marks[pixel_url] = article_dir

    available_marks = [mark for mark in marks if mark not in used_marks]
    pending = [article for article, mark in values_by_article.items() if not mark]
    if len(available_marks) < len(pending):
        raise ValueError(
            f"Nicht genug Zählmarken: {len(pending)} Artikel benötigen Marken, "
            f"aber nur {len(available_marks)} sind frei."
        )

    updates = {}
    assigned = 0
    for article_dir in article_dirs:
        pixel_url = values_by_article[article_dir]
        if not pixel_url:
            pixel_url = available_marks[assigned]
            assigned += 1
        for path in pages_by_article[article_dir]:
            updated_text = set_vgwort(all_texts[path], pixel_url, path)
            if updated_text != all_texts[path]:
                updates[path] = updated_text

    for path, text in updates.items():
        path.write_text(text, encoding="utf-8")

    remaining = len(available_marks) - assigned
    return len(article_dirs), assigned, remaining


def main():
    try:
        article_count, assigned_count, remaining_count = assign_marks()
    except (OSError, ValueError) as error:
        print(f"VG-Wort-Zuteilung fehlgeschlagen: {error}", file=sys.stderr)
        return 1

    print(
        f"VG Wort: {article_count} Artikelpaare geprüft, "
        f"{assigned_count} neue Marken zugeteilt, {remaining_count} Marken übrig."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
