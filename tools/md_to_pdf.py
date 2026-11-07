"""Convert TECHNICAL.md and USER-GUIDE.md to PDF."""
from __future__ import annotations

import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
BRAND_NAVY = HexColor("#1e3a8a")
BRAND_BLUE = HexColor("#1a56db")
BRAND_LIGHT = HexColor("#f8fafc")
CODE_BG = HexColor("#f1f5f9")
BORDER = HexColor("#cbd5e1")
MUTED = HexColor("#475569")


def make_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="DocTitle",
            parent=styles["Title"],
            fontSize=20,
            leading=26,
            textColor=BRAND_NAVY,
            spaceAfter=6,
            fontName="Helvetica-Bold",
        )
    )
    styles.add(
        ParagraphStyle(
            name="H1",
            parent=styles["Heading1"],
            fontSize=14,
            leading=18,
            textColor=BRAND_NAVY,
            spaceBefore=16,
            spaceAfter=8,
            fontName="Helvetica-Bold",
        )
    )
    styles.add(
        ParagraphStyle(
            name="H2",
            parent=styles["Heading2"],
            fontSize=12,
            leading=16,
            textColor=BRAND_BLUE,
            spaceBefore=12,
            spaceAfter=6,
            fontName="Helvetica-Bold",
        )
    )
    styles.add(
        ParagraphStyle(
            name="H3",
            parent=styles["Heading3"],
            fontSize=11,
            leading=14,
            textColor=BRAND_NAVY,
            spaceBefore=10,
            spaceAfter=4,
            fontName="Helvetica-Bold",
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["Normal"],
            fontSize=9.5,
            leading=13,
            textColor=black,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CodeBlock",
            parent=styles["Code"],
            fontName="Courier",
            fontSize=7.5,
            leading=10,
            backColor=CODE_BG,
            leftIndent=4,
            rightIndent=4,
            spaceBefore=4,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Cell",
            parent=styles["Normal"],
            fontSize=8,
            leading=11,
            textColor=black,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CellHeader",
            parent=styles["Normal"],
            fontSize=8,
            leading=11,
            textColor=white,
            fontName="Helvetica-Bold",
        )
    )
    styles.add(
        ParagraphStyle(
            name="BulletBody",
            parent=styles["Normal"],
            fontSize=9.5,
            leading=13,
            leftIndent=14,
            spaceAfter=3,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Footer",
            parent=styles["Normal"],
            fontSize=8,
            textColor=MUTED,
            alignment=TA_CENTER,
        )
    )
    return styles


def escape_xml(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline_md(text: str) -> str:
    """Convert limited markdown inline to reportlab XML (placeholders avoid nest clashes)."""
    slots: list[str] = []

    def stash(html: str) -> str:
        slots.append(html)
        return f"\x00SLOT{len(slots) - 1}\x00"

    # Protect code spans first (asterisks inside must not become italics)
    def code_repl(m: re.Match) -> str:
        return stash(f'<font face="Courier" size="8">{escape_xml(m.group(1))}</font>')

    text = re.sub(r"`([^`]+)`", code_repl, text)

    # Links
    def link_repl(m: re.Match) -> str:
        label = escape_xml(m.group(1))
        url = m.group(2).replace('"', "&quot;")
        return stash(f'<link href="{url}" color="#1a56db"><u>{label}</u></link>')

    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link_repl, text)

    text = escape_xml(text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", text)

    def unstash(m: re.Match) -> str:
        return slots[int(m.group(1))]

    return re.sub(r"\x00SLOT(\d+)\x00", unstash, text)


def parse_table(lines: list[str]) -> list[list[str]]:
    rows: list[list[str]] = []
    for line in lines:
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if all(re.match(r"^:?-+:?$", c) for c in cells):
            continue
        rows.append(cells)
    return rows


def table_flowable(rows: list[list[str]], styles):
    if not rows:
        return Spacer(1, 1)
    col_count = max(len(r) for r in rows)
    normalized = [r + [""] * (col_count - len(r)) for r in rows]
    data = []
    for i, row in enumerate(normalized):
        style = styles["CellHeader"] if i == 0 else styles["Cell"]
        data.append([Paragraph(inline_md(cell), style) for cell in row])

    usable = A4[0] - 36 * 2
    col_w = usable / col_count
    t = Table(data, colWidths=[col_w] * col_count, repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BRAND_NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("BACKGROUND", (0, 1), (-1, -1), white),
                ("GRID", (0, 0), (-1, -1), 0.4, BORDER),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, BRAND_LIGHT]),
            ]
        )
    )
    return t


def md_to_story(md_text: str, styles):
    story = []
    lines = md_text.splitlines()
    i = 0
    first_h1_done = False
    in_code = False
    code_lines: list[str] = []

    while i < len(lines):
        line = lines[i]

        if line.strip().startswith("```"):
            if not in_code:
                in_code = True
                code_lines = []
            else:
                in_code = False
                code = "\n".join(code_lines) if code_lines else " "
                story.append(Preformatted(code, styles["CodeBlock"], maxLineLength=95))
            i += 1
            continue
        if in_code:
            code_lines.append(line)
            i += 1
            continue

        if line.strip().startswith("|"):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i])
                i += 1
            rows = parse_table(table_lines)
            story.append(Spacer(1, 4))
            story.append(table_flowable(rows, styles))
            story.append(Spacer(1, 8))
            continue

        if not line.strip():
            i += 1
            continue

        if re.match(r"^-{3,}\s*$", line.strip()):
            story.append(Spacer(1, 6))
            story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER, spaceAfter=8))
            i += 1
            continue

        m = re.match(r"^(#{1,3})\s+(.*)$", line)
        if m:
            level = len(m.group(1))
            text = inline_md(m.group(2))
            if level == 1 and not first_h1_done:
                story.append(Paragraph(text, styles["DocTitle"]))
                first_h1_done = True
            elif level == 1:
                story.append(Paragraph(text, styles["H1"]))
            elif level == 2:
                story.append(Paragraph(text, styles["H2"]))
            else:
                story.append(Paragraph(text, styles["H3"]))
            i += 1
            continue

        if re.match(r"^(\s*)([-*]|\d+\.)\s+", line):
            while i < len(lines):
                full = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", lines[i])
                if not full:
                    break
                content = full.group(3)
                if content.startswith("[ ]") or content.lower().startswith("[x]"):
                    mark = "☐ " if content.startswith("[ ]") else "☑ "
                    content = mark + content[3:].strip()
                story.append(Paragraph("• " + inline_md(content), styles["BulletBody"]))
                i += 1
            continue

        para = [line]
        i += 1
        while i < len(lines):
            nxt = lines[i]
            if (
                not nxt.strip()
                or nxt.strip().startswith("|")
                or nxt.strip().startswith("#")
                or nxt.strip().startswith("```")
                or re.match(r"^-{3,}\s*$", nxt.strip())
                or re.match(r"^(\s*)([-*]|\d+\.)\s+", nxt)
            ):
                break
            para.append(nxt)
            i += 1
        text = " ".join(p.strip() for p in para)
        story.append(Paragraph(inline_md(text), styles["Body"]))

    return story


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    page = canvas.getPageNumber()
    canvas.drawCentredString(A4[0] / 2, 12 * mm, f"Global HR  ·  {doc.title}  ·  {page}")
    canvas.setStrokeColor(BORDER)
    canvas.line(18 * mm, 16 * mm, A4[0] - 18 * mm, 16 * mm)
    canvas.restoreState()


def build_pdf(md_path: Path, pdf_path: Path, title: str):
    styles = make_styles()
    md_text = md_path.read_text(encoding="utf-8")
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=20 * mm,
        title=title,
        author="Global HR",
        creator="Global HR website docs",
    )
    doc.title = title
    story = md_to_story(md_text, styles)
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(f"Wrote {pdf_path} ({pdf_path.stat().st_size} bytes)")


def main():
    build_pdf(ROOT / "TECHNICAL.md", ROOT / "TECHNICAL.pdf", "Technical Guide")
    build_pdf(ROOT / "USER-GUIDE.md", ROOT / "USER-GUIDE.pdf", "User Guide")
    print("Done")


if __name__ == "__main__":
    main()
