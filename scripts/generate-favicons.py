"""Generate favicon assets from assets/logo.png."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
LOGO = ROOT / "assets" / "logo.png"
OUT = ROOT / "assets"

BRAND_NAVY = (30, 58, 138, 255)  # #1e3a8a


def crop_hr_mark(img: Image.Image) -> Image.Image:
    """Use the distinctive HR + swoosh portion of the wide logo."""
    w, h = img.size
    return img.crop((int(w * 0.48), 0, w, h))


def fit_square(img: Image.Image, size: int, bg=BRAND_NAVY) -> Image.Image:
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    w, h = img.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), bg)
    offset = ((side - w) // 2, (side - h) // 2)
    canvas.paste(img, offset, img)
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    logo = Image.open(LOGO).convert("RGBA")
    mark = crop_hr_mark(logo)

    favicon_32 = fit_square(mark, 32)
    favicon_16 = fit_square(mark, 16)
    apple = fit_square(mark, 180)

    favicon_32.save(OUT / "favicon-32.png")
    favicon_16.save(OUT / "favicon-16.png")
    apple.save(OUT / "apple-touch-icon.png")
    favicon_16.save(
        OUT / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32)],
        append_images=[favicon_32],
    )
    print("Wrote favicon.ico, favicon-16/32.png, apple-touch-icon.png")


if __name__ == "__main__":
    main()
