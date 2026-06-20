import shutil

from pathlib import Path

import django

ADMIN_ICONS = [
    "icon-deletelink.svg",
    "icon-addlink.svg",
    "icon-changelink.svg",
]


def copy_admin_icons(app):
    src_dir = (
        Path(django.__file__).resolve()
        / "contrib"
        / "admin"
        / "static"
        / "admin"
        / "img"
    )
    dst_dir = Path(app.srcdir) / "static" / "admin" / "img"
    dst_dir.mkdir(parents=True, exist_ok=True)

    for name in ADMIN_ICONS:
        src = src_dir / name
        if src.exists():
            shutil.copy2(src, dst_dir / name)


def setup(app):
    app.connect("builder-inited", copy_admin_icons)
    return {"version": "1.0", "parallel_read_safe": True}
