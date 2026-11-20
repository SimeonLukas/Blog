import csv
import tempfile
import unittest
from pathlib import Path

from assign_marks import assign_marks, load_marks, read_vgwort, split_frontmatter


MARKS = (
    "https://vg04.met.vgwort.de/na/00000000000040008000000000000001",
    "https://vg04.met.vgwort.de/na/00000000000040008000000000000002",
)


def write_export(path, marks):
    rows = [["", "VG WORT"], ["", "Zählmarken"]]
    for index, mark in enumerate(marks, start=1):
        rows.append(
            [
                str(index),
                mark.replace("https://", "http://"),
                f'<img src="{mark}" width="1" height="1" alt="">',
            ]
        )
        rows.append(["", "Privater Identifikationscode:", "fake-private-code"])
    with path.open("w", encoding="utf-8", newline="") as output:
        csv.writer(output, delimiter=";").writerows(rows)


class AssignMarksTests(unittest.TestCase):
    def test_reads_https_pixels_but_not_private_codes(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            export = Path(temp_dir) / "marke.csv"
            write_export(export, MARKS)
            self.assertEqual(load_marks(export), list(MARKS))

    def test_assigns_one_stable_mark_to_each_translation_pair(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            posts = root / "posts"
            article = posts / "artikel"
            article.mkdir(parents=True)
            export = root / "marke.csv"
            write_export(export, MARKS)

            for name in ("index.md", "index.en.md"):
                (article / name).write_text(
                    '+++\ntitle = "Artikel"\n[extra]\ncomment = true\n+++\nText\n',
                    encoding="utf-8",
                )

            self.assertEqual(assign_marks(posts, export), (1, 1, 1))
            values = []
            for name in ("index.md", "index.en.md"):
                page = article / name
                lines, closing_index = split_frontmatter(page.read_text(encoding="utf-8"), page)
                value, _ = read_vgwort(lines, closing_index, page)
                values.append(value)
                self.assertNotIn("fake-private-code", page.read_text(encoding="utf-8"))
            self.assertEqual(values, [MARKS[0], MARKS[0]])

            assigned_content = [
                (article / name).read_text(encoding="utf-8")
                for name in ("index.md", "index.en.md")
            ]
            self.assertEqual(assign_marks(posts, export), (1, 0, 1))
            self.assertEqual(
                [(article / name).read_text(encoding="utf-8") for name in ("index.md", "index.en.md")],
                assigned_content,
            )

    def test_insufficient_marks_does_not_modify_posts(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            posts = root / "posts"
            contents = []
            for name in ("one", "two"):
                article = posts / name
                article.mkdir(parents=True)
                page = article / "index.md"
                content = f'+++\ntitle = "{name}"\n+++\nText\n'
                page.write_text(content, encoding="utf-8")
                contents.append((page, content))

            export = root / "marke.csv"
            write_export(export, MARKS[:1])

            with self.assertRaisesRegex(ValueError, "Nicht genug Zählmarken"):
                assign_marks(posts, export)
            for page, content in contents:
                self.assertEqual(page.read_text(encoding="utf-8"), content)


if __name__ == "__main__":
    unittest.main()
