# WordPress Integration Guide

This guide will help you integrate the Kalki Maa Noor Ananta Timeline into your WordPress website.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Method 1: Custom Page Template](#method-1-custom-page-template-recommended)
3. [Method 2: Custom HTML Block](#method-2-custom-html-block-simple)
4. [Method 3: File Upload to Theme](#method-3-file-upload-to-theme)
5. [Method 4: Child Theme Integration](#method-4-child-theme-integration-advanced)
6. [Troubleshooting](#troubleshooting)

---

## Overview

You have **4 different methods** to integrate this timeline into WordPress. Choose based on your technical skill level:

| Method | Difficulty | Best For |
|--------|-----------|----------|
| Custom Page Template | ⭐⭐⭐ | Full control, professional sites |
| Custom HTML Block | ⭐ | Quick integration, no coding |
| File Upload | ⭐⭐ | Direct file access |
| Child Theme | ⭐⭐⭐⭐ | Advanced customization |

---

## Method 1: Custom Page Template (Recommended)

### Step 1: Create Page Template File

1. Go to **Appearance → Theme File Editor**
2. Click "Add New File" (or create via FTP)
3. Name it: `page-timeline.php`
4. Paste this code:

```php
<?php
/**
 * Template Name: Timeline Full Width
 * Description: Full-width timeline template
 */

get_header(); ?>

<style>
    /* Remove default WordPress theme padding/margins */
    .site-content { padding: 0 !important; margin: 0 !important; }
    .entry-content { max-width: none !important; padding: 0 !important; }
    #primary { max-width: none !important; }
    .container { max-width: none !important; }
    
    /* Hide default content area elements */
    .entry-header, .entry-footer, .post-navigation { display: none !important; }
</style>

<!-- Include Timeline CSS -->
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/timeline/css/styles.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

<!-- Timeline Content (copy from index.html body, starting from <header>) -->
<header class="header">
    <!-- ... full header content ... -->
</header>

<!-- ... rest of timeline HTML ... -->

<!-- Include Timeline JavaScript -->
<script src="<?php echo get_template_directory_uri(); ?>/timeline/js/app.js"></script>

<?php get_footer(); ?>
```

### Step 2: Upload Files via FTP/File Manager

1. Connect to your WordPress via FTP or cPanel File Manager
2. Navigate to: `/wp-content/themes/YOUR-ACTIVE-THEME/`
3. Create a folder named: `timeline`
4. Upload these folders inside `timeline/`:
   ```
   /timeline/
   ├── css/
   │   └── styles.css
   ├── js/
   │   └── app.js
   ├── data/
   │   └── timeline_data.json
   └── images/
       └── KalkiMaaNoorAnantaLife-YYYY/
   ```

### Step 3: Create Page in WordPress

1. Go to **Pages → Add New**
2. Title: "Life Timeline"
3. **Page Template**: Select "Timeline Full Width"
4. Publish!

---

## Method 2: Custom HTML Block (Simple)

### Step 1: Upload Files

Upload all files to your server via FTP:
```
/public_html/timeline/
├── index.html
├── css/
├── js/
├── data/
└── images/
```

### Step 2: Create WordPress Page

1. **Pages → Add New**
2. Add a **Custom HTML Block**
3. Paste this code:

```html
<iframe src="/timeline/index.html" 
        style="width: 100%; min-height: 100vh; border: none;" 
        title="Life Timeline"
        id="timeline-iframe">
</iframe>

<script>
    // Auto-resize iframe
    window.addEventListener('message', function(e) {
        if (e.data.hasOwnProperty('frameHeight')) {
            document.getElementById('timeline-iframe').style.height = e.data.frameHeight + 'px';
        }
    });
</script>
```

4. Add this to your `index.html` (in `<script>` section):

```javascript
// Send height to parent iframe
function sendHeight() {
    window.parent.postMessage({
        frameHeight: document.documentElement.scrollHeight
    }, '*');
}
window.addEventListener('load', sendHeight);
window.addEventListener('resize', sendHeight);
```

---

## Method 3: File Upload to Theme

### Step 1: Prepare Files

1. Create a ZIP file of the entire `kalki-timeline-website` folder
2. Or prepare to upload via FTP

### Step 2: Upload to WordPress

**Via FTP/cPanel:**
```
/wp-content/uploads/timeline/
├── index.html
├── css/
├── js/
├── data/
└── images/
```

### Step 3: Link from WordPress

1. Create a new page
2. Add a **Button** or **Link**
3. Set link to: `https://yoursite.com/wp-content/uploads/timeline/index.html`

**OR** embed using iframe (see Method 2)

---

## Method 4: Child Theme Integration (Advanced)

### Step 1: Create Child Theme

If you don't have a child theme:

1. Create folder: `/wp-content/themes/your-theme-child/`
2. Create `style.css`:

```css
/*
Theme Name: Your Theme Child
Template: your-parent-theme
*/

@import url("../your-parent-theme/style.css");
```

3. Create `functions.php`:

```php
<?php
function child_theme_enqueue_styles() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/style.css', array('parent-style'));
}
add_action('wp_enqueue_scripts', 'child_theme_enqueue_styles');
```

### Step 2: Add Timeline Template

1. Copy `page-timeline.php` to child theme
2. Upload timeline files to child theme:
   ```
   /your-theme-child/timeline/
   ```

### Step 3: Enqueue Scripts Properly

Add to child theme's `functions.php`:

```php
function timeline_enqueue_scripts() {
    if (is_page_template('page-timeline.php')) {
        // Enqueue Timeline CSS
        wp_enqueue_style(
            'timeline-styles',
            get_stylesheet_directory_uri() . '/timeline/css/styles.css',
            array(),
            '1.0.0'
        );
        
        // Enqueue Timeline JS
        wp_enqueue_script(
            'timeline-app',
            get_stylesheet_directory_uri() . '/timeline/js/app.js',
            array(),
            '1.0.0',
            true
        );
        
        // Enqueue Google Fonts
        wp_enqueue_style(
            'timeline-fonts',
            'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap',
            array(),
            null
        );
    }
}
add_action('wp_enqueue_scripts', 'timeline_enqueue_scripts');
```

---

## 🎨 Removing WordPress Theme Styles

### Option 1: Add to Page Template

```php
<?php
// Remove theme styles for timeline page
function remove_theme_styles() {
    if (is_page_template('page-timeline.php')) {
        // Remove all theme styles
        wp_dequeue_style('theme-style');
        wp_dequeue_style('style');
        
        // Remove default WordPress blocks CSS
        wp_dequeue_style('wp-block-library');
        wp_dequeue_style('wp-block-library-theme');
    }
}
add_action('wp_enqueue_scripts', 'remove_theme_styles', 100);
```

### Option 2: CSS Override

Add this to timeline's `styles.css`:

```css
/* WordPress theme override */
body.page-template-page-timeline {
    margin: 0 !important;
    padding: 0 !important;
}

.page-template-page-timeline .site-content,
.page-template-page-timeline .entry-content,
.page-template-page-timeline #primary {
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
}
```

---

## 🔧 Troubleshooting

### Images Not Loading

**Problem**: Images show broken icons

**Solutions**:
1. Check file paths in `timeline_data.json`:
   ```json
   "image": "2016-03-26-01.jpg"  // Should be just filename
   ```

2. Verify images are uploaded to:
   ```
   /timeline/images/KalkiMaaNoorAnantaLife-YYYY/
   ```

3. Check image permissions (should be 644):
   ```bash
   chmod 644 images/**/*.jpg
   ```

4. Update path in `js/app.js` if needed:
   ```javascript
   const imagePath = `<?php echo get_template_directory_uri(); ?>/timeline/images/KalkiMaaNoorAnantaLife-${event.year}/${event.image}`;
   ```

### JSON Data Not Loading

**Problem**: "Failed to load timeline data"

**Solutions**:
1. Check JSON file is uploaded correctly
2. Test JSON in browser: `https://yoursite.com/timeline/data/timeline_data.json`
3. Check JSON syntax: Use [JSONLint](https://jsonlint.com/)
4. Check file permissions (should be 644)

### Timeline Looks Broken

**Problem**: Layout is messed up

**Solutions**:
1. Clear WordPress cache (if using cache plugin)
2. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check browser console for errors: `F12` → Console tab
4. Verify CSS file is loading
5. Add CSS override to force full width (see above)

### WordPress Menu Showing

**Problem**: Theme menu appears above timeline

**Solutions**:

Add to page template:
```php
<?php
// Hide navigation
remove_action('genesis_header', 'genesis_do_nav');
remove_action('genesis_header', 'genesis_do_subnav');
?>
```

Or use CSS:
```css
.page-template-page-timeline .site-header,
.page-template-page-timeline .nav-primary {
    display: none !important;
}
```

### Mobile Responsive Issues

**Problem**: Timeline doesn't look good on mobile

**Solutions**:
1. Add viewport meta tag to page template:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. Test responsive breakpoints work
3. Check theme isn't overriding mobile styles

---

## 📊 Performance Optimization

### 1. Enable Caching

Use a caching plugin:
- WP Super Cache
- W3 Total Cache
- WP Rocket

### 2. Image Optimization

Optimize images before upload:
```bash
# Using ImageMagick
mogrify -quality 85 -resize 800x800\> *.jpg

# Or use online tools
# - TinyPNG
# - ImageOptim
# - Squoosh
```

### 3. Enable Gzip Compression

Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>
```

### 4. CDN for Fonts

The timeline already uses Google Fonts CDN, but you can also:
- Self-host fonts for better performance
- Use system fonts for faster loading

---

## 🔐 Security Notes

1. **File Permissions**:
   ```
   Folders: 755
   Files: 644
   ```

2. **htaccess Protection** (if data is sensitive):
   ```apache
   <FilesMatch "\.json$">
       Order allow,deny
       Deny from all
   </FilesMatch>
   ```
   Then load data via PHP proxy instead of direct access.

3. **Regular Backups**: Always backup before making changes

---

## 📞 Need Help?

1. Check WordPress debug log:
   ```php
   // Add to wp-config.php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```

2. Check browser console for JavaScript errors
3. Test in different browsers
4. Ask in WordPress forums with specific error details

---

## ✅ Checklist

Before going live:

- [ ] All files uploaded correctly
- [ ] Images loading properly
- [ ] JSON data accessible
- [ ] Timeline displays correctly
- [ ] Search functionality works
- [ ] Filters work
- [ ] Modal opens/closes properly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Cache cleared
- [ ] Tested in multiple browsers

---

**🎉 Congratulations!** Your timeline should now be live on WordPress!
