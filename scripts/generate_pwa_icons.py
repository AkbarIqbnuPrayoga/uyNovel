import os
from PIL import Image, ImageDraw, ImageFont

def create_gradient(width, height, color1, color2, color3):
    """Create a smooth diagonal gradient image."""
    base = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    for y in range(height):
        for x in range(width):
            # Normalized diagonal factor 0.0 to 1.0
            t = (x + y) / (width + height)
            
            if t < 0.5:
                # Interpolate between color1 and color2
                factor = t * 2.0
                r = int(color1[0] + (color2[0] - color1[0]) * factor)
                g = int(color1[1] + (color2[1] - color1[1]) * factor)
                b = int(color1[2] + (color2[2] - color1[2]) * factor)
            else:
                # Interpolate between color2 and color3
                factor = (t - 0.5) * 2.0
                r = int(color2[0] + (color3[0] - color2[0]) * factor)
                g = int(color2[1] + (color3[1] - color2[1]) * factor)
                b = int(color2[2] + (color3[2] - color2[2]) * factor)
                
            base.putpixel((x, y), (r, g, b, 255))
    return base

def draw_uynovel_icon(size=1024, is_maskable=False):
    """
    Renders the UYNovel brand icon.
    is_maskable: if True, keeps all vital elements within the 80% safe zone.
    """
    scale = size / 512.0
    
    # Render at high resolution
    render_size = 1024
    s = render_size / 512.0
    
    # 1. Base gradient
    # Deep navy #0D0F1F, rich indigo #1E234A, vivid purple-indigo #6659F5
    col1 = (13, 15, 31)     # #0D0F1F
    col2 = (34, 38, 77)     # #22264D
    col3 = (102, 89, 245)   # #6659F5
    
    img = create_gradient(render_size, render_size, col1, col2, col3)
    draw = ImageDraw.Draw(img)
    
    # Radial ambient highlight in top-left and center
    center_glow = Image.new('RGBA', (render_size, render_size), (0, 0, 0, 0))
    cg_draw = ImageDraw.Draw(center_glow)
    
    # Add a soft glowing circle
    glow_r = int(180 * s)
    glow_center = (int(256 * s), int(230 * s))
    for r in range(glow_r, 0, -2):
        alpha = int(45 * (1 - r / glow_r))
        cg_draw.ellipse(
            [glow_center[0] - r, glow_center[1] - r, glow_center[0] + r, glow_center[1] + r],
            fill=(145, 136, 255, alpha)
        )
    img = Image.alpha_composite(img, center_glow)
    draw = ImageDraw.Draw(img)
    
    # If not maskable, we can draw a subtle modern squircle border and soft rounded corners
    if not is_maskable:
        # Create rounded mask
        mask = Image.new('L', (render_size, render_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        corner_r = int(95 * s)
        mask_draw.rounded_rectangle([0, 0, render_size, render_size], radius=corner_r, fill=255)
        
        # Apply mask
        img.putalpha(mask)
        draw = ImageDraw.Draw(img)
        
        # Draw subtle inner stroke border
        border_r = int(95 * s)
        draw.rounded_rectangle(
            [int(4 * s), int(4 * s), render_size - int(4 * s), render_size - int(4 * s)],
            radius=border_r,
            outline=(255, 255, 255, 35),
            width=int(4 * s)
        )

    # 2. Draw modern stylized Book Emblem
    # Book spine & open pages silhouette
    book_w = int(140 * s)
    book_h = int(95 * s)
    bx = int(256 * s)
    by = int(155 * s if is_maskable else 165 * s)
    
    # Left page curve
    left_pts = [
        (bx - int(8 * s), by + int(35 * s)),
        (bx - int(65 * s), by + int(50 * s)),
        (bx - book_w // 2, by + int(10 * s)),
        (bx - int(8 * s), by - int(10 * s)),
    ]
    # Right page curve
    right_pts = [
        (bx + int(8 * s), by + int(35 * s)),
        (bx + int(65 * s), by + int(50 * s)),
        (bx + book_w // 2, by + int(10 * s)),
        (bx + int(8 * s), by - int(10 * s)),
    ]
    
    # Subtle pages glow
    draw.polygon(left_pts, fill=(245, 246, 255, 220))
    draw.polygon(right_pts, fill=(197, 190, 255, 240))
    
    # Center spine line
    draw.line([(bx, by - int(15 * s)), (bx, by + int(45 * s))], fill=(255, 255, 255, 255), width=int(5 * s))

    # 3. Typography "UY"
    # We draw geometric high-modern "U" and "Y" letters for clean anti-aliasing
    ty_y = int(245 * s if is_maskable else 255 * s)
    letter_h = int(115 * s)
    stroke_w = int(24 * s)
    
    # Letter U
    # Position: center around bx - 60
    ux = int(185 * s)
    # Left stem
    draw.rounded_rectangle([ux, ty_y, ux + stroke_w, ty_y + letter_h - int(25 * s)], radius=int(6*s), fill=(255, 255, 255, 255))
    # Right stem
    draw.rounded_rectangle([ux + int(65 * s), ty_y, ux + int(65 * s) + stroke_w, ty_y + letter_h - int(25 * s)], radius=int(6*s), fill=(255, 255, 255, 255))
    # Bottom arc
    arc_box = [ux, ty_y + letter_h - int(55 * s), ux + int(65 * s) + stroke_w, ty_y + letter_h]
    draw.pieslice(arc_box, 0, 180, fill=(255, 255, 255, 255))
    inner_arc = [ux + stroke_w, ty_y + letter_h - int(55 * s), ux + int(65 * s), ty_y + letter_h - stroke_w]
    # Draw hollow inside for U
    # Cut out inner hole
    draw.pieslice(inner_arc, 0, 180, fill=col2)

    # Letter Y
    # Position: center around bx + 60
    yx = int(305 * s)
    # Diagonal left branch
    y_center = (yx + int(42 * s), ty_y + int(50 * s))
    draw.line([(yx, ty_y), y_center], fill=(255, 255, 255, 255), width=stroke_w)
    # Diagonal right branch
    draw.line([(yx + int(85 * s), ty_y), y_center], fill=(255, 255, 255, 255), width=stroke_w)
    # Stem down
    draw.rounded_rectangle([y_center[0] - stroke_w // 2, y_center[1] - int(4 * s), y_center[0] + stroke_w // 2, ty_y + letter_h], radius=int(6*s), fill=(255, 255, 255, 255))
    # Rounded joint for Y
    draw.ellipse([y_center[0] - stroke_w // 2, y_center[1] - stroke_w // 2, y_center[0] + stroke_w // 2, y_center[1] + stroke_w // 2], fill=(255, 255, 255, 255))

    # 4. Accent underline pill
    pill_w = int(85 * s)
    pill_h = int(10 * s)
    pill_x = int(256 * s - pill_w // 2)
    pill_y = ty_y + letter_h + int(18 * s)
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=pill_h // 2, fill=(197, 190, 255, 255))
    
    # 5. Small dot accent / spark
    spark_x = pill_x + pill_w + int(14 * s)
    spark_y = pill_y + pill_h // 2
    draw.ellipse([spark_x - int(5 * s), spark_y - int(5 * s), spark_x + int(5 * s), spark_y + int(5 * s)], fill=(145, 136, 255, 255))

    # Resize to desired output size using Lanczos resampling
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

def main():
    icons_dir = os.path.join(os.getcwd(), 'public', 'icons')
    os.makedirs(icons_dir, exist_ok=True)
    
    print("Generating UYNovel PWA icons...")
    
    # 1. Standard Icons
    icon_192 = draw_uynovel_icon(192, is_maskable=False)
    icon_192.save(os.path.join(icons_dir, 'icon-192x192.png'), 'PNG')
    print("[OK] Created public/icons/icon-192x192.png")
    
    icon_512 = draw_uynovel_icon(512, is_maskable=False)
    icon_512.save(os.path.join(icons_dir, 'icon-512x512.png'), 'PNG')
    print("[OK] Created public/icons/icon-512x512.png")
    
    # Copy 512 as root icon.png
    icon_512.save(os.path.join(os.getcwd(), 'public', 'icon.png'), 'PNG')
    print("[OK] Created public/icon.png")

    # 2. Maskable Icons (full bleed, elements inside 80% circle)
    maskable_192 = draw_uynovel_icon(192, is_maskable=True)
    maskable_192.save(os.path.join(icons_dir, 'icon-maskable-192x192.png'), 'PNG')
    print("[OK] Created public/icons/icon-maskable-192x192.png")
    
    maskable_512 = draw_uynovel_icon(512, is_maskable=True)
    maskable_512.save(os.path.join(icons_dir, 'icon-maskable-512x512.png'), 'PNG')
    print("[OK] Created public/icons/icon-maskable-512x512.png")

    # 3. Apple Touch Icon (180x180, square without transparency)
    apple_icon = draw_uynovel_icon(180, is_maskable=True)
    apple_icon.convert('RGB').save(os.path.join(icons_dir, 'apple-touch-icon.png'), 'PNG')
    print("[OK] Created public/icons/apple-touch-icon.png")

    # 4. Favicon (16, 32, 48)
    fav_16 = draw_uynovel_icon(16, is_maskable=False)
    fav_32 = draw_uynovel_icon(32, is_maskable=False)
    fav_48 = draw_uynovel_icon(48, is_maskable=False)
    fav_32.save(os.path.join(os.getcwd(), 'public', 'favicon.ico'), format='ICO', sizes=[(16,16), (32,32), (48,48)])
    fav_32.save(os.path.join(icons_dir, 'favicon-32x32.png'), 'PNG')
    print("[OK] Created public/favicon.ico and favicon-32x32.png")

    print("All PWA icons generated successfully!")

if __name__ == '__main__':
    main()
